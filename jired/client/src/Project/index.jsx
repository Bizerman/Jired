import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Route, Redirect, useRouteMatch, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { PageLoader, PageError, Modal } from 'shared/components';
import api from '../shared/utils/api';
import { useLanguage } from 'context/LanguageContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProjectToolbar from './Board/Toolbar';
import Board from './Board';
import ProjectBoardHeader from './Board/Header';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import ProjectSummary from './Summary';
import ProjectReports from './Reports';
import ProjectIssues from './ProjectIssues';
import ProjectAttachments from './ProjectAttachments';
import ProjectCreate from '../ProjectCreate';
import { ProjectPage } from './Styles';
import { IssueStatus } from 'shared/constants/issues';

const Project = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useLanguage();
  const [{ data: currentUserData }] = useApi.get('/users/current.json');
  const currentUser = currentUserData?.user;
  const searchParams = new URLSearchParams(location.search);
  const newProjectIdParam = searchParams.get('newProjectId');
  const retryTimerRef = useRef(null);
  const retryCountRef = useRef(0);
  const isSummaryPage = location.pathname === `${match.url}/summary`;
  const isIssuesPage = location.pathname === `${match.url}/issues`;
  const isAttachmentsPage = location.pathname === `${match.url}/attachments`;
  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');
  const [projectId, setProjectId] = useState(() => {
    if (newProjectIdParam) {
      const id = parseInt(newProjectIdParam, 10);
      localStorage.setItem('currentProjectId', newProjectIdParam);
      return id;
    }
    const stored = localStorage.getItem('currentProjectId');
    const id = parseInt(stored, 10);
    return isNaN(id) ? null : id;
  });
  const [isNewlyCreated, setIsNewlyCreated] = useState(!!newProjectIdParam);

  useEffect(() => {
    if (newProjectIdParam) {
      history.replace('/project/board');
    }
  }, []); // пустой массив – сработает один раз

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

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

          // 1. Получаем все трекеры
          const trackersRes = await api.get('/trackers.json');
          const allTrackers = trackersRes.trackers || [];

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
          const prioritiesRes = await api.get('/enumerations/issue_priorities.json');
          const priorities = prioritiesRes.issue_priorities || [];
          // 3. Загружаем задачи проекта
          const issuesRes = await api.get('/issues.json', {
            project_id: projectId,
            limit: 100,
            status_id: '*',
            include: 'attachments',
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
              priority_id: issue.priority?.id,
              userIds: issue.assigned_to ? [issue.assigned_to.id] : [],
              statusKey,
              status_id: issue.status?.id,
              lock_version: issue.lock_version,
              updatedAt: issue.updated_on,
            };
          });

          if (isMountedRef.current) {
            setProjectData({
              ...data,
              project: {
                ...data.project,
                issues: mappedIssues,
                statuses,
                priorities,
                users: [],
              },
            });
            setIsNewlyCreated(false);
            retryCountRef.current = 0; // сброс счётчика попыток
          }
        } catch (e) {
          console.error('Metadata loading error', e);
          if (isMountedRef.current) {
            setProjectData(data);
          }
        }
        if (isMountedRef.current) setIsProjectLoading(false);
      })
      .catch(error => {
        console.log('Full error:', error);
        console.log('error.status:', error.status);
        const status = error?.status; // Ваш api.js кладёт статус прямо сюда

        if (isMountedRef.current) {
          // Если только что создали и получили 404 — пробуем ещё раз
          if (isNewlyCreated && status === 404) {
            if (retryCountRef.current < 5) {
              retryCountRef.current++;
              console.log(`Project not ready yet, retry ${retryCountRef.current}/5 in 2s...`);
              setIsProjectLoading(true);
              retryTimerRef.current = setTimeout(() => {
                fetchProject(url); // используем url, а не projectId из состояния
              }, 2000);
              return;
            }
            // Исчерпали попытки — показываем ошибку
            console.log('Max retries reached, treating as error.');
            setProjectError(error);
            setIsProjectLoading(false);
            setIsNewlyCreated(false);
            return;
          }

          // Обычная ошибка
          setProjectError(error);
          setIsProjectLoading(false);
          setIsNewlyCreated(false);
        }
      });
  }, []); // зависимости не меняются, всё необходимое замкнуто

  const setLocalProjectData = useCallback((updater) => {
    setProjectData(prev => updater(prev));
  }, []);

  const moveIssueInList = useCallback((statusKey, sourceIndex, destinationIndex) => {
    setLocalProjectData(prevData => {
      const issues = [...prevData.project.issues];
      const columnIndices = issues
        .map((issue, idx) => (issue.statusKey === statusKey ? idx : null))
        .filter(idx => idx !== null);
      const sourceGlobalIdx = columnIndices[sourceIndex];
      const destGlobalIdx = columnIndices[destinationIndex];
      const [moved] = issues.splice(sourceGlobalIdx, 1);
      issues.splice(destGlobalIdx, 0, moved);
      return {
        project: {
          ...prevData.project,
          issues,
        },
      };
    });
  }, []);
  const updateAllIssues = useCallback((newIssues) => {
    setLocalProjectData(prevData => ({
      project: {
        ...prevData.project,
        issues: newIssues,
      },
    }));
  }, [setLocalProjectData]);
  const moveIssuesInColumn = useCallback((statusKey, orderedIds) => {
    setLocalProjectData(prevData => {
      const issues = [...prevData.project.issues];
      const otherIssues = issues.filter(i => i.statusKey !== statusKey);
      const colIssuesMap = new Map(
        issues.filter(i => i.statusKey === statusKey).map(i => [i.id, i])
      );
      const newColIssues = orderedIds.map(id => colIssuesMap.get(id)).filter(Boolean);
      const statusOrder = Object.values(IssueStatus);
      let result = [];
      for (const st of statusOrder) {
        if (st === statusKey) {
          result.push(...newColIssues);
        } else {
          result.push(...otherIssues.filter(i => i.statusKey === st));
        }
      }
      return {
        project: {
          ...prevData.project,
          issues: result,
        },
      };
    });
  }, [setLocalProjectData]);

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

    // Если мы только что создали проект, игнорируем проверки и просто оставляем projectId
    if (isNewlyCreated) {
      return;
    }

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
  }, [projectsData, history, match.url, isNewlyCreated]);

  useEffect(() => {
    if (!projectError) return;
    const status = projectError?.status; // ваш api кладёт статус в error.status
    if (status === 404) {
      // Для только что созданного проекта не сбрасываем id — ждём повторных попыток
      if (isNewlyCreated) return;

      toast.info('Previously selected project was deleted, switching to another one.');
      localStorage.removeItem('currentProjectId');
      setProjectId(null);
      setProjectError(null);
    }
  }, [projectError, isNewlyCreated]);

  const isCreatePage = history.location.pathname === `${match.url}/create`;

  if (!projectsData) return <PageLoader />;

  // Если список проектов пуст и мы не на странице создания и нет projectId (не новый проект) — редирект на создание
  if (projectsData.projects.length === 0 && !projectId && !isCreatePage) {
    return <Redirect to={`${match.url}/create`} />;
  }

  // Если список пуст, страница создания и проект не новый — показываем форму создания
  if (projectsData.projects.length === 0 && isCreatePage && !isNewlyCreated) {
    return (
      <ProjectPage isCreatePage>
        <Route path={`${match.path}/create`} component={ProjectCreate} />
      </ProjectPage>
    );
  }

  const errorStatus = projectError?.status;
  if (!projectId && projectsData.projects.length > 0) return <PageLoader />;
  if (projectId && isProjectLoading && !projectData) return <PageLoader />;
  if (projectError && errorStatus !== 404) return <PageError />;
  if (errorStatus === 404 && isNewlyCreated) return <PageLoader />;

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
    <>
      {/* Маршрут Summary – с собственным белым контейнером */}
      <Route
        path={`${match.path}/summary`}
        render={() => (
          <>
            {!isCreatePage && (
              <>
                <Navbar
                  issueSearchModalOpen={issueSearchModalHelpers.open}
                  issueCreateModalOpen={issueCreateModalHelpers.open}
                  project={project}
                />
                <Sidebar project={project} />
              </>
            )}
            <div style={{
              padding: '67.5px 32px 62.5px 515px',
              minHeight: '100vh',
              background: '#fff',
              fontFamily: "'Outfit', sans-serif",
            }}>
              <ProjectBoardHeader project={project} />
              <ProjectToolbar baseUrl={match.url.replace(/\/board$/, '')} />
              <ProjectSummary project={project} />
            </div>
          </>
        )}
      />
      <Route
        path={`${match.path}/reports`}
        render={() => (
          <>
            {!isCreatePage && (
              <>
                <Navbar
                  issueSearchModalOpen={issueSearchModalHelpers.open}
                  issueCreateModalOpen={issueCreateModalHelpers.open}
                  project={project}
                />
                <Sidebar project={project} />
              </>
            )}
            <div style={{
              padding: '67.5px 32px 62.5px 515px',
              minHeight: '100vh',
              background: '#fff',
              fontFamily: "'Outfit', sans-serif",
            }}>
              <ProjectBoardHeader project={project} />
              <ProjectToolbar baseUrl={match.url.replace(/\/board$/, '')} />
              <ProjectReports project={project} />
            </div>
          </>
        )}
      />
      <Route
        path={`${match.path}/issues`}
        render={() => (
          <>
            {!isCreatePage && (
              <>
                <Navbar
                  issueSearchModalOpen={issueSearchModalHelpers.open}
                  issueCreateModalOpen={issueCreateModalHelpers.open}
                  project={project}
                />
                <Sidebar project={project} />
              </>
            )}
            <div style={{
              padding: '67.5px 32px 62.5px 515px',
              minHeight: '100vh',
              background: '#fff',
              fontFamily: "'Outfit', sans-serif",
            }}>
              <ProjectBoardHeader project={project} />
              <ProjectToolbar baseUrl={match.url.replace(/\/board$/, '')} />
              <ProjectIssues
                project={project}
                updateIssue={updateLocalProjectIssues}
                currentUser={currentUser}
                fetchProject={fetchProject}
              />
            </div>
          </>
        )}
      />
      <Route
        path={`${match.path}/attachments`}
        render={() => (
          <>
            {!isCreatePage && (
              <>
                <Navbar
                  issueSearchModalOpen={issueSearchModalHelpers.open}
                  issueCreateModalOpen={issueCreateModalHelpers.open}
                  project={project}
                />
                <Sidebar project={project} />
              </>
            )}
            <div style={{ padding: '67.5px 32px 62.5px 515px', minHeight: '100vh', background: '#fff', fontFamily: "'Outfit', sans-serif" }}>
              <ProjectBoardHeader project={project} />
              <ProjectToolbar baseUrl={match.url.replace(/\/board$/, '')} />
              <ProjectAttachments
                project={project}
                fetchProject={() => fetchProject(`/projects/${project.id}.json?include=issues`)}
              />
            </div>
          </>
        )}
      />
      {!isSummaryPage && !isIssuesPage && !isAttachmentsPage && (
        <ProjectPage isCreatePage={isCreatePage}>
          {!isCreatePage && (
            <>
              <Navbar
                issueSearchModalOpen={issueSearchModalHelpers.open}
                issueCreateModalOpen={issueCreateModalHelpers.open}
                project={project}
              />
              <Sidebar project={project} />
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
                moveIssueInList={moveIssueInList}
                moveIssuesInColumn={moveIssuesInColumn}
                updateAllIssues={updateAllIssues} // <-- НОВЫЙ ПРОП
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
              width={1040}
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
      )}
    </>
  );
};

export default Project;