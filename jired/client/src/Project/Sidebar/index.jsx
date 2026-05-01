import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Icon } from 'shared/components';
import { color } from 'shared/utils/styles';
import default_project_incon from '../../App/assets/imgs/projectdefault.svg';
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
  localStorage.getItem(`project_icon_${projectId}`) || default_project_incon;

const getProjectIconBg = (projectId) =>
  localStorage.getItem(`project_icon_bg_${projectId}`) || color.backgroundMedium;

const RECENT_PROJECTS_KEY = 'recentProjects';
const MAX_RECENT = 5;

const ProjectSidebar = ({ project }) => {
  const history = useHistory();
  const location = useLocation();   // 👈 этот хук даёт актуальный ключ при каждом переходе
  const [recentProjects, setRecentProjects] = useState([]);
  const [showRecent, setShowRecent] = useState(true);

  const [{ data: projectsData }] = useApi.get('/projects.json');

  // Обновляем историю посещений при входе в проект
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_PROJECTS_KEY) || '[]');
      const updated = [project.id, ...stored.filter(id => id !== project.id)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(updated));
    } catch {
      localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify([project.id]));
    }
  }, [project.id]);

  // Формируем список недавних проектов – теперь зависит от location.key
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
  }, [projectsData, project.id, location.key]);   // 👈 ключ меняется → эффект срабатывает

  const handleProjectSwitch = (projectId) => {
    localStorage.setItem('currentProjectId', projectId);
    window.location.href = '/project/board';
  };

  return (
    <SidebarContainer>
      <SectionHeader>
        <SectionTitle>Projects</SectionTitle>
        <PlusButton onClick={() => history.push('/project/create')} title="Create project">
          <Icon type="plus" size={18} color="#725757" />
        </PlusButton>
      </SectionHeader>

      <RecentButton onClick={() => setShowRecent(!showRecent)}>
        <Icon type="chevron-down" size={15} color="#5E3F3F" />
        <span>RECENT</span>
      </RecentButton>

      {showRecent && (
        <div style={{ marginTop: 8 }}>
          {recentProjects.length === 0 && (
            <div style={{ padding: '8px 12px', fontSize: 14, color: color.textMedium }}>
              No recent projects
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
                  <ProjectCategory>{ProjectCategoryCopy[rp.category]}</ProjectCategory>
                </div>
              </RecentDropdownItem>
            );
          })}
        </div>
      )}

      <ViewAllLink onClick={() => history.push('/projects')}>View all projects</ViewAllLink>
    </SidebarContainer>
  );
};

export default ProjectSidebar;