import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { PageLoader, Modal, Icon } from 'shared/components';
import { color } from 'shared/utils/styles';
import api from 'shared/utils/api';
import Navbar from '../Project/Navbar';
import IssueSearch from '../Project/IssueSearch';
import IssueCreate from '../Project/IssueCreate';
import defaultProjectIcon from 'App/assets/imgs/projectdefault.svg';
import { useLanguage } from 'context/LanguageContext';
import TaskList from './TaskList';
import {
  PageWrapper,
  WorkHeader,
  Title,
  Divider,
  SectionTitleRow,
  SectionTitle,
  ProjectGrid,
  ProjectCard,
  LeftAccent,
  AccentBar,
  IconWrapper,
  ProjectIconImage,
  CardBody,
  CardHeader,
  CardTitle,
  CardMeta,
  CardDivider,
  CardLinks,
  LinkText,
  IssueCount,
  TaskTabs,
  Tab,
  ViewAllLink,
  ProjectCardCreate,
  CreateProjectText,
  LoadingMessage,
} from './Styles';

const RECENT_PROJECTS_KEY = 'recentProjects';
const MAX_RECENT = 5;

const getProjectIcon = (projectId) =>
  localStorage.getItem(`project_icon_${projectId}`) || defaultProjectIcon;

const getProjectIconBg = (projectId) =>
  localStorage.getItem(`project_icon_bg_${projectId}`) || '#A14949';

const YourWork = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useLanguage();
  const initialTab = new URLSearchParams(location.search).get('tab') || 'worked-on';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => setActiveTab(initialTab), [initialTab]);

  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  const [projects, setProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setIsProjectsLoading(true);
    try {
      const res = await api.get('/projects.json');
      setProjects(res.projects || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setIsProjectsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    api.get('/users/current.json')
      .then(res => setCurrentUser(res.user || null))
      .catch(() => {});
  }, []);

  const currentUserId = currentUser?.id;
  const [myIssues, setMyIssues] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    setIsTasksLoading(true);
    api.get(`/issues.json?assigned_to_id=${currentUserId}&status_id=*&limit=1000`)
      .then(res => {
        const raw = res.issues || [];
        const normalized = raw.map(issue => ({
          ...issue,
          title: issue.subject,
          type: 'task',
          userIds: issue.assigned_to ? [issue.assigned_to.id] : [],
        }));
        setMyIssues(normalized);
      })
      .catch(err => console.error('Failed to fetch my issues', err))
      .finally(() => setIsTasksLoading(false));
  }, [currentUserId]);
  const myOpenIssues = myIssues.filter(issue => !issue.status?.is_closed);

  const [recentProjects, setRecentProjects] = useState([]);
  const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  useEffect(() => {
    if (!projects.length) return;
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_PROJECTS_KEY) || '[]');
      const recent = stored
        .map(id => projects.find(p => p.id === id))
        .filter(Boolean)
        .slice(0, MAX_RECENT);
      setRecentProjects(recent);
    } catch {
      setRecentProjects(projects.slice(0, MAX_RECENT));
    }
  }, [projects]);

  const defaultProject = useMemo(() => {
    if (projects.length === 0) return { name: 'Jired', issues: [] };
    return { ...projects[0], issues: myIssues };
  }, [projects, myIssues]);

  if (isProjectsLoading) return <PageLoader />;

  return (
    <>
      <Navbar
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
        project={defaultProject}
        createDisabled
      />

      {issueSearchModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="search"
          withCloseIcon={false}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch project={defaultProject} />}
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
              project={defaultProject}
              fetchProject={() => {}}
              onCreate={() => history.push('/project/board')}
              modalClose={modal.close}
            />
          )}
        />
      )}

      <PageWrapper>
        <WorkHeader>
          <Title>{t('yourWork')}</Title>
          <Divider />
        </WorkHeader>

        <SectionTitleRow>
          <span>{t('recentProjects')}</span>
          <ViewAllLink onClick={() => history.push('/projects')}>{t('viewAllProjects')}</ViewAllLink>
        </SectionTitleRow>

        <ProjectGrid>
          {recentProjects.map(project => {
            const iconSrc = getProjectIcon(project.id);
            const iconBg = getProjectIconBg(project.id);
            const myOpenCount = myOpenIssues.filter(issue => issue.project?.id === project.id).length;

            return (
              <ProjectCard key={project.id} onClick={() => {
                localStorage.setItem('currentProjectId', project.id);
                window.location.href = '/project/board';
              }}>
                <LeftAccent bg={iconBg}>
                  <AccentBar bg={iconBg} />
                  <IconWrapper bg={iconBg}>
                    <ProjectIconImage src={iconSrc} alt="" />
                  </IconWrapper>
                </LeftAccent>
                <CardBody>
                  <div>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardMeta>{stripHtml(project.description) || t('noDescription')}</CardMeta>
                    </CardHeader>
                    <CardDivider />
                    <CardLinks>
                      <LinkText>{t('myOpenIssues')}</LinkText>
                      <IssueCount>{myOpenCount}</IssueCount>
                    </CardLinks>
                    <LinkText as="button" onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('currentProjectId', project.id);
                      window.location.href = '/project/board?done=1';
                    }}>
                      {t('doneIssues')}
                    </LinkText>
                  </div>
                </CardBody>
              </ProjectCard>
            );
          })}
          <ProjectCardCreate onClick={() => history.push('/project/create')}>
            <Icon type="plus" size={24} color={color.textMedium} />
            <CreateProjectText>{t('createProject')}</CreateProjectText>
          </ProjectCardCreate>
        </ProjectGrid>

        <TaskTabs>
          <Tab active={activeTab === 'worked-on'} onClick={() => history.push('/your-work?tab=worked-on')}>
            {t('workedOn')}
          </Tab>
          <Tab active={activeTab === 'assigned-to-me'} onClick={() => history.push('/your-work?tab=assigned-to-me')}>
            {t('assignedToMe')}
          </Tab>
        </TaskTabs>

        {isTasksLoading ? (
          <LoadingMessage>{t('loadingTasks')}</LoadingMessage>
        ) : (
          <>
            {activeTab === 'worked-on' && (
              <div>
                <SectionTitle>{t('recentlyUpdatedByYou')}</SectionTitle>
                <TaskList
                  issues={myIssues
                    .sort((a, b) => new Date(b.updated_on) - new Date(a.updated_on))
                    .slice(0, 10)
                  }
                />
              </div>
            )}
            {activeTab === 'assigned-to-me' && (
              <div>
                <SectionTitle>{t('openTasksAssignedToMe')}</SectionTitle>
                <TaskList issues={myOpenIssues} />
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </>
  );
};

export default YourWork;