import React from 'react';
import { useHistory } from 'react-router-dom';
import useApi from 'shared/hooks/api';
import { PageLoader } from 'shared/components';
import Navbar from '../Project/Navbar';
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
  ProgressBar,
  ProgressFill,
  CardFooter,
  FooterText,
  MetaList,
  MetaRow,
  MetaLabel,
  MetaValue,
  ViewAllLink,
} from './Styles';        // новые компоненты Meta*
import defaultProjectIcon from 'App/assets/imgs/projectdefault.svg';
import { createQueryParamModalHelpers } from 'shared/utils/queryParamModal';

const getProjectIcon = (projectId) => {
  return localStorage.getItem(`project_icon_${projectId}`) || defaultProjectIcon;
};

const getProjectIconBg = (projectId) => {
  return localStorage.getItem(`project_icon_bg_${projectId}`) || '#A14949';
};

const AllProjects = () => {
    const history = useHistory();
    const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
    const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

    const [{ data: projectsData, isLoading }] = useApi.get('/projects.json');
    const projects = projectsData?.projects || [];

    const defaultProject = projects[0]
        ? { ...projects[0], issues: [] }
        : { name: 'Jired', issues: [] };

    const [{ data: allIssuesData }] = useApi.get('/issues.json?limit=1000');
    const allIssues = allIssuesData?.issues || [];
    const stripHtml = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    const getProjectStats = (projectId) => {
        const projectIssues = allIssues.filter(issue => {
        const pid = issue.project?.id || issue.project_id;
        return pid === projectId;
        });
        const total = projectIssues.length;
        const closed = projectIssues.filter(issue => issue.status?.is_closed).length;
        const progress = total > 0 ? Math.round((closed / total) * 100) : 0;
        return { total, closed, progress };
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
            issueCreateModalOpen={issueSearchModalHelpers.open}
            project={defaultProject}
        />

        <PageWrapper>
            <WorkHeader>
            <Title>All projects</Title>
            <Divider />
            </WorkHeader>

            <SectionTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Projects</span>
                <ViewAllLink onClick={() => history.push('/project/create')}>
                    + Create project
                </ViewAllLink>
                </SectionTitle>
            <ProjectGrid>
            {projects.map((project) => {
                const iconSrc = getProjectIcon(project.id);
                const iconBg = getProjectIconBg(project.id);
                const stats = getProjectStats(project.id);

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
                    <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardMeta>{stripHtml(project.description) || 'No description'}</CardMeta>
                    </CardHeader>

                    {/* Мета-информация: Identifier, Access, Inherit members */}
                    <MetaList>
                        <MetaRow>
                        <MetaLabel>Identifier</MetaLabel>
                        <MetaValue>{project.identifier}</MetaValue>
                        </MetaRow>
                        <MetaRow>
                        <MetaLabel>Access</MetaLabel>
                        <MetaValue>{project.is_public ? 'Public' : 'Private'}</MetaValue>
                        </MetaRow>
                        <MetaRow>
                        <MetaLabel>Members</MetaLabel>
                        <MetaValue>{project.inherit_members ? 'Inherited' : 'Not inherited'}</MetaValue>
                        </MetaRow>
                    </MetaList>

                    <CardDivider />
                    <CardLinks>
                        <LinkText>All tasks</LinkText>
                        <IssueCount>{stats.total}</IssueCount>
                    </CardLinks>
                    <ProgressBar>
                        <ProgressFill width={stats.progress} />
                    </ProgressBar>
                    <CardFooter>
                        <FooterText>{stats.closed} of {stats.total} completed</FooterText>
                    </CardFooter>
                    </CardBody>
                </ProjectCard>
                );
            })}
            </ProjectGrid>
        </PageWrapper>
        </>
    );
};

export default AllProjects;