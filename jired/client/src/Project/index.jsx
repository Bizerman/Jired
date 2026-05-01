import React, { useState, useEffect, useCallback,useRef  } from 'react';
import { Route, Redirect, useRouteMatch, useHistory } from 'react-router-dom';

import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { PageLoader, PageError, Modal } from 'shared/components';
import api from '../shared/utils/api';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Board from './Board';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import ProjectCreate from '../ProjectCreate';
import { ProjectPage } from './Styles';
import { IssueStatus } from 'shared/constants/issues';

const Project = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  const [projectId, setProjectId] = useState(() => {
    const stored = localStorage.getItem('currentProjectId');
    const id = parseInt(stored, 10);
    return isNaN(id) ? null : id;
  });

  const [{ data: projectsData }] = useApi.get('/projects.json');

  const [projectData, setProjectData] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const [isProjectLoading, setIsProjectLoading] = useState(false);

  const fetchProject = useCallback((url) => {
    if (!url) return;
    setIsProjectLoading(true);
    setProjectError(null);

    api.get(url)
      .then(async (data) => {
        try {
          const projectId = data.project.id;

          // 1. Получаем все трекеры (или хотя бы список id)
          const trackersRes = await api.get('/trackers.json');
          const allTrackers = trackersRes.trackers || [];

          // Привязываем каждый трекер к проекту (если ещё не привязан)
          for (const tracker of allTrackers) {
            try {
              await api.post(`/projects/${projectId}/trackers/${tracker.id}.json`);
            } catch (e) {
              // игнорируем ошибку, если уже привязан
            }
          }

          // 2. Загружаем справочник статусов
          const statusesRes = await api.get('/issue_statuses.json');
          const statuses = statusesRes.issue_statuses || [];

          // 3. Загружаем задачи проекта (все, включая закрытые)
          const issuesRes = await api.get('/issues.json', {
            project_id: projectId,
            limit: 100,
            status_id: '*',          // получить все статусы, включая Done
          });
          const rawIssues = issuesRes.issues || [];
          console.log('Total issues loaded:', rawIssues.length);

          // 4. Нормализуем задачи
          const mappedIssues = rawIssues.map(issue => {
            const foundTracker = issue.tracker?.name || 'Task';
            const foundPriority = issue.priority?.id ?? 2;
            const foundStatus = statuses.find(s => s.id === issue.status?.id);
            let statusKey = null;

            if (foundStatus) {
              const name = foundStatus.name.trim().toLowerCase();
              console.log(`Issue #${issue.id}: status="${foundStatus.name}" -> key="${name}"`);
              if (name.includes('backlog')) statusKey = IssueStatus.BACKLOG;
              else if (name.includes('selected')) statusKey = IssueStatus.SELECTED;
              else if (name.includes('in progress')) statusKey = IssueStatus.INPROGRESS;
              else if (name.includes('done')) statusKey = IssueStatus.DONE;
              else {
                statusKey = IssueStatus.BACKLOG;
                console.warn(`Unknown status "${foundStatus.name}" mapped to Backlog`);
              }
            }

            return {
              ...issue,
              title: issue.subject || '',
              type: foundTracker === 'Bug' ? 'bug' : foundTracker === 'Story' ? 'story' : 'task',
              priority: String(foundPriority),
              userIds: issue.assigned_to ? [issue.assigned_to.id] : [],
              statusKey,
              status_id: issue.status?.id,
              lock_version: issue.lock_version,
            };
          });
          if (isMountedRef.current) {
          setProjectData({
            ...data,
            project: {
              ...data.project,
              issues: mappedIssues,
              statuses,
              users: [],
            },
          });
        }
        } catch (e) {
          console.error('Metadata loading error', e);
          setProjectData(data);
        }
        if (isMountedRef.current) setIsProjectLoading(false);
      })
      .catch(error => {
        if (isMountedRef.current) {
          setProjectError(error);
          setIsProjectLoading(false);
        }
      });
  }, []);

  const setLocalProjectData = useCallback((updater) => {
    setProjectData(prev => updater(prev));
  }, []);

  const isMountedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);
  useEffect(() => {
    if (typeof projectId === 'number' && !isNaN(projectId)) {
      fetchProject(`/projects/${projectId}.json?include=issues`);
    }
  }, [projectId, fetchProject]);

  useEffect(() => {
    if (!projectsData) return;

    if (projectsData.projects.length === 0) {
      if (history.location.pathname !== `${match.url}/create`) {
        history.push(`${match.url}/create`);
      }
      return;
    }

    const storedId = localStorage.getItem('currentProjectId');
    if (storedId) {
      const idNum = parseInt(storedId, 10);
      const exists = projectsData.projects.some(p => p.id === idNum);
      if (exists) {
        setProjectId(idNum);
        return;
      } else {
        localStorage.removeItem('currentProjectId');
        toast.info('Previously selected project was deleted, switching to another one.');
      }
    }

    const firstId = Number(projectsData.projects[0].id);
    if (!isNaN(firstId)) {
      localStorage.setItem('currentProjectId', firstId);
      setProjectId(firstId);
    }
  }, [projectsData, history, match.url]);

  useEffect(() => {
    if (projectError && projectError.status === 404) {
      toast.info('Previously selected project was deleted, switching to another one.');
      localStorage.removeItem('currentProjectId');
      setProjectId(null);
      setProjectError(null);
    }
  }, [projectError]);

  const isCreatePage = history.location.pathname === `${match.url}/create`;

  if (!projectsData) return <PageLoader />;

  if (projectsData.projects.length === 0 && !isCreatePage) {
    return <Redirect to={`${match.url}/create`} />;
  }

  if (projectsData.projects.length === 0 && isCreatePage) {
    return (
      <ProjectPage isCreatePage>
        <Route path={`${match.path}/create`} component={ProjectCreate} />
      </ProjectPage>
    );
  }

  if (!projectId && projectsData.projects.length > 0) return <PageLoader />;
  if (projectId && isProjectLoading && !projectData) return <PageLoader />;
  if (projectError && projectError.status !== 404) return <PageError />;

  const projectFromRedmine = projectData?.project;
  const project = projectFromRedmine
    ? {
        ...projectFromRedmine,
        users: projectFromRedmine.users || [],
        issues: projectFromRedmine.issues || [],
      }
    : null;

  if (!project) return <PageLoader />;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalProjectData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  return (
    <ProjectPage isCreatePage={isCreatePage}>
      {!isCreatePage && (
        <>
          <Navbar
            issueSearchModalOpen={issueSearchModalHelpers.open}
            issueCreateModalOpen={issueCreateModalHelpers.open}
            project={project}
          />
          <Sidebar
            project={project}
          />
        </>
      )}

      <Route path={`${match.path}/create`} component={ProjectCreate} />
      <Route
        path={`${match.path}/board`}
        render={() => (
          <Board
            project={project}
            fetchProject={() => fetchProject(`/projects/${project.id}.json?include=issues`)}
            updateLocalProjectIssues={updateLocalProjectIssues}
          />
        )}
      />
      <Route
        path={`${match.path}/settings`}
        render={() => (
          <ProjectSettings
            project={project}
            fetchProject={() => fetchProject(`/projects/${project.id}.json?include=issues`)}
          />
        )}
      />

      {issueSearchModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="search"
          withCloseIcon={false}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch project={project} />}
        />
      )}
      {issueCreateModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={issueCreateModalHelpers.close}
          renderContent={modal => (
            <IssueCreate
              project={project}
              fetchProject={() => fetchProject(`/projects/${project.id}.json?include=issues`)}
              onCreate={() => {
                fetchProject(`/projects/${project.id}.json?include=issues`);
                history.push(`${match.url}/board`);
              }}
              modalClose={modal.close}
            />
          )}
        />
      )}

      {match.isExact && <Redirect to={`${match.url}/board`} />}
    </ProjectPage>
  );
};

export default Project;