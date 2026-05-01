import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useApi from 'shared/hooks/api';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';
import { PageLoader, Modal } from 'shared/components';
import { Icon } from 'shared/components';
import { color } from 'shared/utils/styles';
import Navbar from '../Project/Navbar';
import IssueSearch from '../Project/IssueSearch';
import IssueCreate from '../Project/IssueCreate';
import defaultProjectIcon from 'App/assets/imgs/projectdefault.svg';
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
  TodaySection,
  EventList,
  EventItem,
  EventIconBox,
  EventTitles,
  EventTitleText,
  EventMeta,
  EventCreators,
  CreatorBlock,
  CreatorLabel,
  StyledAvatar,
  ViewAllLink,
  ProjectCardCreate,
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
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'worked-on';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
  const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

  const [{ data: projectsData, isLoading }] = useApi.get('/projects.json');
  const projects = projectsData?.projects || [];

  // Получаем ID текущего пользователя
  const [{ data: currentUserData }] = useApi.get('/users/current.json');
  const currentUserId = currentUserData?.user?.id;

  // Загружаем ВСЕ открытые задачи, назначенные на меня (по всем проектам)
  const [{ data: allOpenIssuesData }] = useApi.get(
    currentUserId ? '/issues.json?assigned_to_id=me&status_id=open&limit=1000' : null,
    {},
    { lazy: !currentUserId }
  );
  const allOpenIssues = allOpenIssuesData?.issues || [];

  // Загружаем ВСЕ закрытые задачи по всем проектам (командный счетчик)
  const [{ data: allClosedIssuesData }] = useApi.get(
    '/issues.json?status_id=closed&limit=1000',
    {},
    { lazy: false }
  );
  const allClosedIssues = allClosedIssuesData?.issues || [];

  // Формируем список недавних проектов
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

  const todaysTasks = [
    // ... без изменений
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    history.push(`/your-work?tab=${tab}`);
  };

  const handleProjectSwitch = (projectId) => {
    localStorage.setItem('currentProjectId', projectId);
    window.location.href = '/project/board';
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <Navbar
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
        project={defaultProject}
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
          <Title>Your work</Title>
          <Divider />
        </WorkHeader>

        <SectionTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Recent projects</span>
          <ViewAllLink onClick={() => history.push('/projects')}>
            View all projects
          </ViewAllLink>
        </SectionTitle>
        <ProjectGrid>
          {recentProjects.map((project) => {
            const iconSrc = getProjectIcon(project.id);
            const iconBg = getProjectIconBg(project.id);

            // Подсчитываем счётчики
            const myOpenCount = allOpenIssues.filter(issue => issue.project?.id === project.id).length;

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
                      <CardMeta>{stripHtml(project.description) || 'No description'}</CardMeta>
                    </CardHeader>
                    <CardDivider />
                    <CardLinks>
                      <LinkText>My open issues</LinkText>
                      <IssueCount>{myOpenCount}</IssueCount>
                    </CardLinks>
                    <LinkText>Done issues</LinkText>
                  </div>
                </CardBody>
              </ProjectCard>
            );
          })}
          <ProjectCardCreate onClick={() => history.push('/project/create')}>
            <Icon type="plus" size={24} color={color.textMedium} />
            <span style={{ color: color.textMedium, fontWeight: 500 }}>Create project</span>
          </ProjectCardCreate>
        </ProjectGrid>

        <TaskTabs>
          <Tab active={activeTab === 'worked-on'} onClick={() => handleTabChange('worked-on')}>Worked on</Tab>
          <Tab active={activeTab === 'viewed'} onClick={() => handleTabChange('viewed')}>Viewed</Tab>
          <Tab active={activeTab === 'assigned-to-me'} onClick={() => handleTabChange('assigned-to-me')}>Assigned to me</Tab>
          <Tab active={activeTab === 'starred'} onClick={() => handleTabChange('starred')}>Starred</Tab>
        </TaskTabs>

        {activeTab === 'worked-on' && (
          <TodaySection>
            <SectionTitle>TODAY</SectionTitle>
            <EventList>
              {todaysTasks.map((item, idx) => (
                <EventItem key={idx}>
                  <EventIconBox />
                  <EventTitles>
                    <EventTitleText>{item.title}</EventTitleText>
                    <EventMeta>{item.meta}</EventMeta>
                  </EventTitles>
                </EventItem>
              ))}
            </EventList>
            <EventCreators>
              {[...Array(9)].map((_, i) => (
                <CreatorBlock key={i}>
                  <CreatorLabel>Created</CreatorLabel>
                  <StyledAvatar size={32} />
                </CreatorBlock>
              ))}
            </EventCreators>
          </TodaySection>
        )}

        {activeTab === 'viewed' && <SectionTitle>Viewed items (coming soon)</SectionTitle>}
        {activeTab === 'starred' && <SectionTitle>Starred projects (coming soon)</SectionTitle>}
        {activeTab === 'assigned-to-me' && <SectionTitle>Assigned to me (use board filter)</SectionTitle>}
      </PageWrapper>
    </>
  );
};

export default YourWork;