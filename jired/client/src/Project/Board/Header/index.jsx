import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Icon } from 'shared/components';
import {
  Header,
  ProjectTitle,
  ProjectIconBox,
  BoardName,
  SettingsBtn,
} from './Styles';
import { color } from 'shared/utils/styles';
import defaultProjectIcon from '../../../App/assets/imgs/projectdefault.svg';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectBoardHeader = ({ project }) => {
  const history = useHistory();
  const [iconSrc, setIconSrc] = useState(defaultProjectIcon);
  const [iconBg, setIconBg] = useState(color.backgroundMedium);
  useEffect(() => {
    const savedIcon = localStorage.getItem(`project_icon_${project.id}`);
    if (savedIcon) {
      setIconSrc(savedIcon);
    } else {
      setIconSrc(defaultProjectIcon);
    }
  }, [project.id]);

  useEffect(() => {
  const savedBg = localStorage.getItem(`project_icon_bg_${project.id}`);
  if (savedBg) setIconBg(savedBg);
}, [project.id]);

  const handleSettingsClick = () => {
    history.push('/project/settings');
  };

  return (
    <Header>
      <ProjectTitle>
        <ProjectIconBox bg={iconBg}>
          <img
            src={iconSrc}
            alt="Project icon"
            style={{ width: '70%', height: '70%', objectFit: 'contain' }}
          />
        </ProjectIconBox>
        <BoardName>{project.name}</BoardName>
      </ProjectTitle>
      <SettingsBtn onClick={handleSettingsClick}>
        <Icon type="settings" size={16} />
        Project settings
      </SettingsBtn>
    </Header>
  );
};

ProjectBoardHeader.propTypes = propTypes;

export default ProjectBoardHeader;