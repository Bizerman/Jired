import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { IssueTypeIcon, Avatar, Modal } from 'shared/components';
import { Icon } from 'shared/components';
import { Link } from 'react-router-dom';
import gridicon from '../../App/assets/imgs/fi-sr-grid.svg';
import useApi from 'shared/hooks/api';
import { removeStoredAuthToken } from 'shared/utils/authToken';
import { getPriorityMeta } from 'shared/utils/priorities';
import { useLanguage } from 'context/LanguageContext';
import {
  Navbar,
  LeftSection,
  LogoLink,
  StyledLogo,
  BrandName,
  NavItems,
  NavItemBox,
  NavItemPrimary,
  NavItem,
  CreateButton,
  RightSection,
  SearchContainer,
  SearchInput,
  IconBtn,
  GridButton,
  Iconbox,
  DropdownMenu,
  DropdownItem,
  DropdownWrapper,
  IssueKey,
  IssueTitle,
} from './Styles';

// Компонент флага
const FlagIcon = ({ locale, size = 20 }) => {
  if (locale === 'ru') {
    // Российский триколор
    return (
      <svg width={size} height={size} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="none" stroke="#ccc" strokeWidth="0.5" />
        <clipPath id="ru-clip">
          <circle cx="10" cy="10" r="8" />
        </clipPath>
        <g clipPath="url(#ru-clip)">
          <rect x="2" y="2" width="16" height="5.33" fill="#fff" />
          <rect x="2" y="7.33" width="16" height="5.33" fill="#0039A6" />
          <rect x="2" y="12.66" width="16" height="5.33" fill="#D52B1E" />
        </g>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="none" stroke="#ccc" strokeWidth="0.5" />
      <clipPath id="en-clip">
        <circle cx="10" cy="10" r="8" />
      </clipPath>
      <g clipPath="url(#en-clip)">
        {/* Синий фон */}
        <rect x="2" y="2" width="16" height="16" fill="#012169" />
        {/* Диагонали святого Патрика (красные) */}
        <path d="M2 2L18 18M18 2L2 18" stroke="#C8102E" strokeWidth="2.5" />
        {/* Диагонали святого Патрика (белый контур) */}
        <path d="M2 2L18 18M18 2L2 18" stroke="#FFFFFF" strokeWidth="4" />
        {/* Вертикальный крест святого Георгия (красный) */}
        <line x1="10" y1="2" x2="10" y2="18" stroke="#C8102E" strokeWidth="2" />
        <line x1="2" y1="10" x2="18" y2="10" stroke="#C8102E" strokeWidth="2" />
        {/* Белый контур вокруг георгиевского креста */}
        <line x1="10" y1="2" x2="10" y2="18" stroke="#FFFFFF" strokeWidth="3.5" />
        <line x1="2" y1="10" x2="18" y2="10" stroke="#FFFFFF" strokeWidth="3.5" />
        {/* Поверх кладём красный георгиевский крест ещё раз */}
        <line x1="10" y1="2" x2="10" y2="18" stroke="#C8102E" strokeWidth="1.5" />
        <line x1="2" y1="10" x2="18" y2="10" stroke="#C8102E" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M7 3H4C3.44772 3 3 3.44772 3 4V14C3 14.5523 3.44772 15 4 15H7M12 12L15 9M15 9L12 6M15 9H7"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProjectNavbar = ({
  issueSearchModalOpen,
  issueCreateModalOpen,
  onToggleAdminMode,
  project,
  hideAssignedDropdown = false,
  createDisabled = false,
}) => {
  const history = useHistory();
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const closeTimerRef = useRef(null);
  const userMenuRef = useRef(null);
  const settingsMenuRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current);
  }, []);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [{ data: currentUserData }] = useApi.get('/users/current.json');
  const currentUser = currentUserData?.user;
  const currentUserId = currentUser?.id;
  const currentUserName = currentUser 
    ? `${currentUser.firstname} ${currentUser.lastname}`.trim() 
    : '';

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { locale, switchLanguage, t } = useLanguage();

  const openDropdown = (name) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setHoveredDropdown(name);
  };

  const closeDropdown = () => {
    closeTimerRef.current = setTimeout(() => setHoveredDropdown(null), 150);
  };

  const keepDropdownOpen = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  const tasksList = currentUserId
    ? project.issues.filter((issue) =>
        issue.userIds?.includes(currentUserId) && !issue.status?.is_closed
      )
    : [];

  const renderPriorityIcon = (issue) => {
    const meta = getPriorityMeta(issue);
    return meta ? <img src={meta.src} alt="" style={{ width: '1rem', height: '1rem' }} /> : null;
  };

  const handleTaskClick = (issueId) => {
    history.push(`/project/board/issues/${issueId}`);
    setHoveredDropdown(null);
  };

  const toggleLanguage = () => {
    switchLanguage(locale === 'en' ? 'ru' : 'en');
    setShowSettingsMenu(false);
  };

  const handleLogout = () => {
    removeStoredAuthToken();
    history.push('/authenticate');
  };

  return (
    <Navbar>
      <LeftSection>
        <Iconbox>
          <GridButton onClick={onToggleAdminMode} title={t('toggleAdminMode') || 'Toggle admin mode'}>
            <img src={gridicon} alt="grid" width="20" />
          </GridButton>
          <LogoLink to="/your-work">
            <StyledLogo color="#ad1e1e" />
            <BrandName>Jired</BrandName>
          </LogoLink>
        </Iconbox>

        <NavItems>
          <NavItemBox primary={false}>
            <Link to="/your-work?tab=worked-on" style={{ textDecoration: 'none', color: 'inherit' }}>
              <NavItemPrimary>{t('yourWork')}</NavItemPrimary>
            </Link>
          </NavItemBox>

          <DropdownWrapper
            onMouseEnter={() => openDropdown('tasks')}
            onMouseLeave={closeDropdown}
          >
            <NavItemBox
              primary={hoveredDropdown === 'tasks'}
              onClick={() => {
                history.push('/your-work?tab=assigned-to-me');
                setHoveredDropdown(null);
              }}
            >
              <NavItem>{t('assignedToMe')}</NavItem>
              <Icon size={20} type="chevron-down" />
            </NavItemBox>
            {hoveredDropdown === 'tasks' && (
              <DropdownMenu onMouseEnter={keepDropdownOpen}>
                {currentUser ? (
                  tasksList.length ? (
                    tasksList.map(issue => (
                      <DropdownItem key={issue.id} onClick={() => handleTaskClick(issue.id)}>
                        <IssueTypeIcon type={issue.type} size={16} />
                        {renderPriorityIcon(issue)}
                        <IssueKey>ISSUE-{issue.id}</IssueKey>
                        <IssueTitle>{issue.title}</IssueTitle>
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem>{t('noTasks')}</DropdownItem>
                  )
                ) : (
                  <DropdownItem>{t('loading')}</DropdownItem>
                )}
              </DropdownMenu>
            )}
          </DropdownWrapper>

          <CreateButton onClick={issueCreateModalOpen} disabled={createDisabled}>
            {t('create')}
          </CreateButton>
        </NavItems>
      </LeftSection>

      <SearchContainer>
        <Icon type="search" size={20} />
        <SearchInput
          placeholder={t('search')}
          onClick={issueSearchModalOpen}
          readOnly
        />
      </SearchContainer>

      <RightSection>
        <IconBtn title={t('help')} onClick={() => setShowHelpModal(true)}>
          <Icon type="help" size={20} />
        </IconBtn>

        {/* Шестерёнка с флагом */}
        <div style={{ position: 'relative' }} ref={settingsMenuRef}>
          <IconBtn title={t('settings')} onClick={() => setShowSettingsMenu(!showSettingsMenu)}>
            <Icon type="settings" size={20} />
          </IconBtn>
          {showSettingsMenu && (
            <DropdownMenu style={{ right: 0, left: 'auto', minWidth: '180px' }}>
              <DropdownItem onClick={toggleLanguage}>
                {locale === 'en' ? (
                  <>
                    <span>Русский</span>
                    <FlagIcon locale="ru" size={18} />
                  </>
                ) : (
                  <>
                    <span>English</span>
                    <FlagIcon locale="en" size={18} />
                  </>
                )}
              </DropdownItem>
            </DropdownMenu>
          )}
        </div>

        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <Avatar
            name={currentUserName}
            avatarUrl={currentUser?.avatarUrl}
            size={32}
            style={{ cursor: 'pointer', marginLeft: '8px' }}
            onClick={() => setShowUserMenu(!showUserMenu)}
          />
          {showUserMenu && (
            <DropdownMenu style={{ right: 0, left: 'auto', minWidth: '160px' }}>
              <DropdownItem onClick={handleLogout}>
                <span>{t('logOut')}</span>
                <LogoutIcon />
              </DropdownItem>
            </DropdownMenu>
          )}
        </div>
      </RightSection>

      {/* Модальное окно помощи */}
      <Modal
        isOpen={showHelpModal}
        width="500px"
        onClose={() => setShowHelpModal(false)}
        renderContent={() => (
          <div style={{ padding: '32px', textAlign: 'center', fontFamily: "'Outfit', sans-serif" }}>
            <h2 style={{ marginBottom: '24px', color: '#4a2727' }}>{t('helpTitle')}</h2>
            <p style={{ color: '#725757', fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {t('helpText')}
            </p>
            <button
              onClick={() => setShowHelpModal(false)}
              style={{
                marginTop: '24px',
                padding: '10px 24px',
                backgroundColor: '#AD1E1E',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {t('close') || 'Close'}
            </button>
          </div>
        )}
      />
    </Navbar>
  );
};

ProjectNavbar.propTypes = {
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
  onToggleAdminMode: PropTypes.func,
  project: PropTypes.object,
  hideAssignedDropdown: PropTypes.bool,
  createDisabled: PropTypes.bool,
};

ProjectNavbar.defaultProps = {
  onToggleAdminMode: () => {},
  project: { name: 'Jired', issues: [] },
};

export default ProjectNavbar;