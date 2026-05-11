import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { PageLoader, Modal } from 'shared/components';
import { Icon } from 'shared/components';
import { color } from 'shared/utils/styles';
import api from 'shared/utils/api';
import Navbar from '../Project/Navbar';
import IssueSearch from '../Project/IssueSearch';
import IssueCreate from '../Project/IssueCreate';
import defaultProjectIcon from 'App/assets/imgs/projectdefault.svg';
import { useLanguage } from 'context/LanguageContext';
import {
  PageWrapper,
  WorkHeader,
  Title,
  Divider,
  SectionTitle,
  ProjectGrid,
  ProjectCard,
  LeftAccent,
  AccentBar,
  IconWrapper,
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
  TaskListContainer,
  TaskListItem,
  TaskItemTitle,
  TaskItemMeta,
  TaskIconBox,
  ViewAllLink,
  TaskLeft,
  TaskInfo,
  ProjectCardCreate,
  TaskRight,
  AvatarPic,
  CreatorName,
} from './Styles';

const RECENT_PROJECTS_KEY = 'recentProjects';
const MAX_RECENT = 5;

const getProjectIcon = (projectId) => {
  return localStorage.getItem(`project_icon_${projectId}`) || defaultProjectIcon;
};

const getProjectIconBg = (projectId) => {
  return localStorage.getItem(`project_icon_bg_${projectId}`) || '#A14949';
};

const YourWork = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useLanguage();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'worked-on';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  // Проекты
  const [projects, setProjects] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setIsProjectsLoading(true);
      const res = await api.get('/projects.json');
      setProjects(res.projects || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setIsProjectsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Текущий пользователь
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    api.get('/users/current.json')
      .then(res => setCurrentUser(res.user || null))
      .catch(() => {});
  }, []);

  const currentUserId = currentUser?.id;

  // Задачи, назначенные на меня
  const [myIssues, setMyIssues] = useState([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    setIsTasksLoading(true);
    api.get(`/issues.json?assigned_to_id=${currentUserId}&status_id=*&limit=1000`)
      .then(res => {
        const fetched = res.issues || [];
        console.log('YourWork: my issues count =', fetched.length);
        setMyIssues(fetched);
      })
      .catch(err => {
        console.error('Failed to fetch my issues', err);
      })
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

  const defaultProject = projects[0]
    ? { ...projects[0], issues: [] }
    : { name: 'Jired', issues: [] };

  const TaskList = ({ issues }) => (
    <TaskListContainer>
      {issues.length === 0 ? (
        <div style={{ padding: 16, color: '#7e7e7e' }}>{t('noTasksFound')}</div>
      ) : (
        issues.map(issue => {
          const creator = issue.author;
          const creatorName = creator?.name || t('unknown');
          const creatorAvatar = creator?.avatarUrl;
          const projectName = issue.project?.name || t('unknownProject');
          const issueId = issue.id;
          const title = issue.subject;

          return (
            <TaskListItem key={issue.id} onClick={() => history.push(`/project/board/issues/${issue.id}`)}>
              <TaskLeft>
                <TaskIconBox>
                  <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <path d="M17.8887 5.11108H8.94428C8.60539 5.11108 8.28039 5.24571 8.04076 5.48534C7.80113 5.72497 7.6665 6.04997 7.6665 6.38886V7.66664H8.94428V6.38886H17.8887V12.7778H16.6109V14.0555H17.8887C18.2276 14.0555 18.5526 13.9209 18.7923 13.6813C19.0319 13.4416 19.1665 13.1166 19.1665 12.7778V6.38886C19.1665 6.04997 19.0319 5.72497 18.7923 5.48534C18.5526 5.24571 18.2276 5.11108 17.8887 5.11108Z" fill="white"/>
                    <path d="M14.0557 8.94446H5.11127C4.77239 8.94446 4.44738 9.07908 4.20775 9.31871C3.96812 9.55834 3.8335 9.88335 3.8335 10.2222V16.6111C3.8335 16.95 3.96812 17.275 4.20775 17.5146C4.44738 17.7543 4.77239 17.8889 5.11127 17.8889H14.0557C14.3946 17.8889 14.7196 17.7543 14.9592 17.5146C15.1989 17.275 15.3335 16.95 15.3335 16.6111V10.2222C15.3335 9.88335 15.1989 9.55834 14.9592 9.31871C14.7196 9.07908 14.3946 8.94446 14.0557 8.94446ZM5.11127 16.6111V10.2222H14.0557V16.6111H5.11127Z" fill="white"/>
                  </svg>
                </TaskIconBox>
                <TaskInfo>
                  <TaskItemTitle>{title}</TaskItemTitle>
                  <TaskItemMeta>
                    ISSUE-{issueId} · {projectName}
                  </TaskItemMeta>
                </TaskInfo>
              </TaskLeft>
              <TaskRight>
                <AvatarPic name={creatorName} avatarUrl={creatorAvatar} size={32} />
                <CreatorName>{creatorName}</CreatorName>
              </TaskRight>
            </TaskListItem>
          );
        })
      )}
    </TaskListContainer>
  );

  const handleProjectSwitch = (projectId) => {
    localStorage.setItem('currentProjectId', projectId);
    window.location.href = '/project/board';
  };
  const handleProjectSwitchWithDoneFilter = (projectId) => {
    localStorage.setItem('currentProjectId', projectId);
    window.location.href = '/project/board?done=1';
  };
  if (isProjectsLoading) return <PageLoader />;

  return (
    <>
      <Navbar
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
        project={defaultProject}
        hideAssignedDropdown
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

        <SectionTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{t('recentProjects')}</span>
          <ViewAllLink onClick={() => history.push('/projects')}>{t('viewAllProjects')}</ViewAllLink>
        </SectionTitle>

        <ProjectGrid>
          {recentProjects.map((project) => {
            const iconSrc = getProjectIcon(project.id);
            const iconBg = getProjectIconBg(project.id);
            const myOpenCount = myOpenIssues.filter(issue => issue.project?.id === project.id).length;

            return (
              <ProjectCard key={project.id} onClick={() => handleProjectSwitch(project.id)}>
                <LeftAccent bg={iconBg}>
                  <AccentBar bg={iconBg} />
                  <IconWrapper bg={iconBg}>
                    <img
                      src={iconSrc}
                      alt=""
                      style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                    />
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
                      handleProjectSwitchWithDoneFilter(project.id);
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
            <span style={{ color: color.textMedium, fontWeight: 500 }}>{t('createProject')}</span>
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
          <div style={{ padding: 20 }}>{t('loadingTasks')}</div>
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