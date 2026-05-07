import React from 'react';
import { useHistory } from 'react-router-dom';
import useApi from 'shared/hooks/api';
import { PageLoader } from 'shared/components';
import Navbar from '../Project/Navbar';
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
  ProgressBar,
  ProgressFill,
  CardFooter,
  FooterText,
  MetaList,
  MetaRow,
  MetaLabel,
  MetaValue,
  ViewAllLink,
} from './Styles';
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
    const { t } = useLanguage();
    const issueSearchModalHelpers = createQueryParamModalHelpers('issue-search');
    const issueCreateModalHelpers = createQueryParamModalHelpers('issue-create');

    const [{ data: projectsData, isLoading }] = useApi.get('/projects.json');
    const projects = projectsData?.projects || [];

    const defaultProject = projects[0]
        ? { ...projects[0], issues: [] }
        : { name: 'Jired', issues: [] };

    const [{ data: allIssuesData }] = useApi.get('/issues.json?status_id=*&limit=1000');
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
        const closed = projectIssues.filter(issue => issue.status?.is_closed === true).length;
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
            hideAssignedDropdown
            createDisabled
        />

        <PageWrapper>
            <WorkHeader>
            <Title>{t('allProjects')}</Title>
            <Divider />
            </WorkHeader>

            <SectionTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{t('projectsHeader')}</span>
                <ViewAllLink onClick={() => history.push('/project/create')}>
                    {t('createProjectHeader')}
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
                        <CardMeta>{stripHtml(project.description) || t('noDescription')}</CardMeta>
                    </CardHeader>

                    <MetaList>
                        <MetaRow>
                        <MetaLabel>{t('identifierLabel')}</MetaLabel>
                        <MetaValue>{project.identifier}</MetaValue>
                        </MetaRow>
                        <MetaRow>
                        <MetaLabel>{t('accessLabel')}</MetaLabel>
                        <MetaValue>{project.is_public ? t('publicAccess') : t('privateAccess')}</MetaValue>
                        </MetaRow>
                        <MetaRow>
                        <MetaLabel>{t('membersLabel')}</MetaLabel>
                        <MetaValue>{project.inherit_members ? t('inherited') : t('notInherited')}</MetaValue>
                        </MetaRow>
                    </MetaList>

                    <CardDivider />
                    <CardLinks>
                        <LinkText>{t('allTasks')}</LinkText>
                        <IssueCount>{stats.total}</IssueCount>
                    </CardLinks>
                    <ProgressBar>
                        <ProgressFill width={stats.progress} />
                    </ProgressBar>
                    <CardFooter>
                        <FooterText>{t('completedText', { closed: stats.closed, total: stats.total })}</FooterText>
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