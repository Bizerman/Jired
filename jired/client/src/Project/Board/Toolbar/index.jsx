import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Icon } from 'shared/components';
import { useLanguage } from 'context/LanguageContext';
import {
  ToolbarContainer,
  ToolbarItems,
  ToolbarItem,
  ItemIcon,
  ItemLabel,
} from './Styles';

const ProjectToolbar = ({ baseUrl }) => {
  const match = useRouteMatch();
  const { t } = useLanguage();

  return (
    <ToolbarContainer>
      <ToolbarItems>
        <ToolbarItem as={NavLink} to={`${baseUrl}/summary`} activeClassName="active">
          <ItemIcon>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M5.04102 15.584C5.80041 15.584 6.41602 14.9684 6.41602 14.209C6.41602 13.4496 5.80041 12.834 5.04102 12.834C4.28162 12.834 3.66602 13.4496 3.66602 14.209C3.66602 14.9684 4.28162 15.584 5.04102 15.584Z" fill="currentColor"/>
              <path d="M17.4167 2.75H4.58333C3.3682 2.75146 2.20326 3.23481 1.34403 4.09403C0.484808 4.95326 0.00145554 6.1182 0 7.33333L0 14.6667C0.00145554 15.8818 0.484808 17.0467 1.34403 17.906C2.20326 18.7652 3.3682 19.2485 4.58333 19.25H17.4167C18.6318 19.2485 19.7967 18.7652 20.656 17.906C21.5152 17.0467 21.9985 15.8818 22 14.6667V7.33333C21.9985 6.1182 21.5152 4.95326 20.656 4.09403C19.7967 3.23481 18.6318 2.75146 17.4167 2.75V2.75ZM4.58333 4.58333H17.4167C18.146 4.58333 18.8455 4.87306 19.3612 5.38879C19.8769 5.90451 20.1667 6.60399 20.1667 7.33333H1.83333C1.83333 6.60399 2.12306 5.90451 2.63879 5.38879C3.15451 4.87306 3.85399 4.58333 4.58333 4.58333V4.58333ZM17.4167 17.4167H4.58333C3.85399 17.4167 3.15451 17.1269 2.63879 16.6112C2.12306 16.0955 1.83333 15.396 1.83333 14.6667V9.16667H20.1667V14.6667C20.1667 15.396 19.8769 16.0955 19.3612 16.6112C18.8455 17.1269 18.146 17.4167 17.4167 17.4167Z" fill="currentColor"/>
            </svg>
          </ItemIcon>
          <ItemLabel>{t('summary')}</ItemLabel>
        </ToolbarItem>

        <ToolbarItem
          as={NavLink}
          to={`${baseUrl}/board`}
          activeClassName="active"
          isActive={(_, location) =>
            location.pathname === `${baseUrl}/board` || location.pathname.startsWith(`${baseUrl}/board/`)
          }
        >
          <ItemIcon>
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.83338 0.523804C2.96968 0.523804 0.648193 2.86898 0.648193 5.7619V16.2381C0.648193 19.131 2.96968 21.4762 5.83338 21.4762H21.3889C24.2526 21.4762 26.5741 19.131 26.5741 16.2381V5.7619C26.5741 2.86898 24.2526 0.523804 21.3889 0.523804H5.83338ZM16.2037 3.14285H11.0186V18.8571H16.2037V3.14285ZM18.7963 3.14285V18.8571H21.3889C22.8208 18.8571 23.9815 17.6846 23.9815 16.2381V5.7619C23.9815 4.31544 22.8208 3.14285 21.3889 3.14285H18.7963ZM5.83338 18.8571H8.42597V3.14285H5.83338C4.40153 3.14285 3.24079 4.31544 3.24079 5.7619V16.2381C3.24079 17.6846 4.40153 18.8571 5.83338 18.8571Z" fill="currentColor"/>
            </svg>
          </ItemIcon>
          <ItemLabel>{t('board')}</ItemLabel>
        </ToolbarItem>

        <ToolbarItem as="div" onClick={() => alert('Attachments not implemented')}>
          <ItemIcon>
            <Icon type="attach" size={28} />
          </ItemIcon>
          <ItemLabel>{t('attachments')}</ItemLabel>
        </ToolbarItem>

        <ToolbarItem as="div" onClick={() => alert('Issues not implemented')}>
          <ItemIcon>
            <Icon type="issues" size={28} />
          </ItemIcon>
          <ItemLabel>{t('issues')}</ItemLabel>
        </ToolbarItem>

        <ToolbarItem as={NavLink} to={`${baseUrl}/reports`} activeClassName="active">
          <ItemIcon>
            <Icon type="reports" size={28} />
          </ItemIcon>
          <ItemLabel>{t('reports')}</ItemLabel>
        </ToolbarItem>
      </ToolbarItems>
    </ToolbarContainer>
  );
};

export default ProjectToolbar;