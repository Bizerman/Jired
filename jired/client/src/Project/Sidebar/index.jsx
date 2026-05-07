import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { Icon } from 'shared/components';
import { color } from 'shared/utils/styles';
import { useLanguage } from 'context/LanguageContext';
import default_project_icon from '../../App/assets/imgs/projectdefault.svg';
import {
  Sidebar as SidebarContainer,
  SectionHeader,
  SectionTitle,
  ProjectIconBox,
  ProjectName,
  ProjectCategory,
  ViewAllLink,
  PlusButton,
  RecentButton,
  RecentDropdownItem,
} from './Styles';
import useApi from 'shared/hooks/api';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const getProjectIcon = (projectId) =>
  localStorage.getItem(`project_icon_${projectId}`) || default_project_icon;

const getProjectIconBg = (projectId) =>
  localStorage.getItem(`project_icon_bg_${projectId}`) || color.backgroundMedium;

const RECENT_PROJECTS_KEY = 'recentProjects';
const MAX_RECENT = 5;

const categoryTranslationMap = {
  software: 'categorySoftware',
  marketing: 'categoryMarketing',
  design: 'categoryDesign',
  // добавьте другие категории при необходимости
};

const ProjectSidebar = ({ project }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useLanguage();
  const [recentProjects, setRecentProjects] = useState([]);
  const [showRecent, setShowRecent] = useState(true);

  const [{ data: projectsData }] = useApi.get('/projects.json');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_PROJECTS_KEY) || '[]');
      const updated = [project.id, ...stored.filter(id => id !== project.id)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(updated));
    } catch {
      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify([project.id]));
    }
  }, [project.id]);

  useEffect(() => {
    if (projectsData?.projects) {
      try {
        const stored = JSON.parse(localStorage.getItem(RECENT_PROJECTS_KEY) || '[]');
        const recent = stored
          .map(id => projectsData.projects.find(p => p.id === id))
          .filter(Boolean)
          .slice(0, MAX_RECENT);
        setRecentProjects(recent);
      } catch {
        setRecentProjects([]);
      }
    }
  }, [projectsData, project.id, location.key]);

  const handleProjectSwitch = (projectId) => {
    localStorage.setItem('currentProjectId', projectId);
    window.location.href = '/project/board';
  };

  const mapCategory = (category) => {
    if (!category) return '';
    const key = categoryTranslationMap[category.toLowerCase()] || `category${category.charAt(0).toUpperCase() + category.slice(1)}`;
    return t(key);
  };

  return (
    <SidebarContainer>
      <SectionHeader>
        <SectionTitle>{t('projects')}</SectionTitle>
        <PlusButton onClick={() => history.push('/project/create')} title={t('createProject')}>
          <Icon type="plus" size={18} color="#725757" />
        </PlusButton>
      </SectionHeader>

      <RecentButton onClick={() => setShowRecent(!showRecent)}>
        <Icon type="chevron-down" size={15} color="#5E3F3F" />
        <span>{t('recent')}</span>
      </RecentButton>

      {showRecent && (
        <div style={{ marginTop: 8 }}>
          {recentProjects.length === 0 && (
            <div style={{ padding: '8px 12px', fontSize: 14, color: color.textMedium }}>
              {t('noRecentProjects')}
            </div>
          )}
          {recentProjects.map(rp => {
            const iconSrc = getProjectIcon(rp.id);
            const iconBg = getProjectIconBg(rp.id);
            return (
              <RecentDropdownItem
                key={rp.id}
                isCurrentProject={rp.id === project.id}
                onClick={() => handleProjectSwitch(rp.id)}
              >
                <ProjectIconBox bg={iconBg}>
                  <img
                    src={iconSrc}
                    alt=""
                    style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                  />
                </ProjectIconBox>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <ProjectName>{rp.name}</ProjectName>
                  <ProjectCategory>{mapCategory(rp.category)}</ProjectCategory>
                </div>
              </RecentDropdownItem>
            );
          })}
        </div>
      )}

      <ViewAllLink onClick={() => history.push('/projects')}>{t('viewAllProjects')}</ViewAllLink>
    </SidebarContainer>
  );
};

export default ProjectSidebar;