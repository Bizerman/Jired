import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { IssueTypeIcon, IssuePriorityIcon, Avatar } from 'shared/components';
import { Icon } from 'shared/components';
import { Link } from 'react-router-dom';
import BellIcon from 'shared/components/Bell';
import gridicon from '../../App/assets/imgs/fi-sr-grid.svg';
import useApi from 'shared/hooks/api';
import { getStoredAuthToken, storeAuthToken, removeStoredAuthToken } from 'shared/utils/authToken';
import { getPriorityMeta } from 'shared/utils/priorities';
import { useLanguage } from 'context/LanguageContext'; // <-- импорт контекста языка
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
  UserAvatar,
  GridButton,
  Iconbox,
  DropdownMenu,
  DropdownItem,
  DropdownWrapper,
  IssueKey,
  IssueTitle,
} from './Styles';

const propTypes = {
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
  onToggleAdminMode: PropTypes.func,
  project: PropTypes.object,
  hideAssignedDropdown: PropTypes.bool,
  createDisabled: PropTypes.bool,
};

const defaultProps = {
  onToggleAdminMode: () => {},
  project: { name: 'Jired', issues: [] },
};

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

  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current);
  }, []);

  const [{ data: currentUserData }] = useApi.get('/users/current.json');
  const currentUser = currentUserData?.user;
  const currentUserId = currentUser?.id;
  const currentUserName = currentUser 
    ? `${currentUser.firstname} ${currentUser.lastname}`.trim() 
    : '';
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  const initials = getInitials(currentUserName);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // --- язык ---
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
    ? project.issues.filter((issue) => issue.userIds?.includes(currentUserId))
    : [];
    
  const renderPriorityIcon = (issue) => {
    const meta = getPriorityMeta(issue);
    return meta ? <img src={meta.src} alt="" style={{ width: '1rem', height: '1rem' }} /> : null;
  };
  const handleTaskClick = (issueId) => {
    history.push(`/project/board/issues/${issueId}`);
    setHoveredDropdown(null);
  };

  const handleYourWorkClick = (destination) => {
    history.push(`/your-work?tab=${destination}`);
    setHoveredDropdown(null);
  };
  const handleLogout = () => {
    removeStoredAuthToken();
    history.push('/authenticate');
  };

  // переключение языка (EN <-> RU)
  const toggleLanguage = () => {
    switchLanguage(locale === 'en' ? 'ru' : 'en');
  };

  return (
    <Navbar>
      <LeftSection>
        <Iconbox>
          <GridButton onClick={onToggleAdminMode} title="Toggle admin mode">
            <img src={gridicon} alt="grid" width="20" />
          </GridButton>
          <LogoLink to="/your-work">
            <StyledLogo color="#ad1e1e" />
            <BrandName>Jired</BrandName>
          </LogoLink>
        </Iconbox>

        <NavItems>
          {/* Your work (выпадающее меню) */}
          <DropdownWrapper
            onMouseEnter={() => openDropdown('your-work')}
            onMouseLeave={closeDropdown}
          >
            <NavItemBox primary={hoveredDropdown === 'your-work'}>
              <Link to="/your-work" style={{ textDecoration: 'none', color: 'inherit' }}>
                <NavItemPrimary>{t('yourWork')}</NavItemPrimary>
              </Link>
              <Icon size={20} type="chevron-down" />
            </NavItemBox>
            {hoveredDropdown === 'your-work' && (
              <DropdownMenu onMouseEnter={keepDropdownOpen}>
                <DropdownItem onClick={() => handleYourWorkClick('worked-on')}>
                  {t('workedOn')}
                </DropdownItem>
                <DropdownItem onClick={() => handleYourWorkClick('viewed')}>
                  {t('viewed')}
                </DropdownItem>
                <DropdownItem onClick={() => handleYourWorkClick('starred')}>
                  {t('starred')}
                </DropdownItem>
              </DropdownMenu>
            )}
          </DropdownWrapper>

          {/* Assigned to me */}
          {hideAssignedDropdown ? (
            <NavItemBox
              onClick={() => history.push('/your-work?tab=assigned-to-me')}
            >
              <NavItem>{t('assignedToMe')}</NavItem>
            </NavItemBox>
          ) : (
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
          )}

          <CreateButton
            onClick={issueCreateModalOpen}
            disabled={createDisabled} 
          >
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
        <IconBtn title={t('notifications')}>
          <BellIcon size={25} color="currentColor" />
        </IconBtn>
        <IconBtn title={t('help')}>
          <Icon type="help" size={20} />
        </IconBtn>
        <IconBtn title={t('settings')}>
          <Icon type="settings" size={20} />
        </IconBtn>
        <div style={{ position: 'relative' }}>
          <Avatar
            name={currentUserName}
            avatarUrl={currentUser?.avatarUrl}
            size={32}
            style={{ cursor: 'pointer', marginLeft: '8px' }}
            onClick={() => setShowUserMenu(!showUserMenu)}
          />
          {showUserMenu && (
            <DropdownMenu
              style={{ right: 0, left: 'auto', minWidth: '120px' }}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {/* Кнопка смены языка – над выходом */}
              <DropdownItem onClick={toggleLanguage}>
                {t('language')}: {locale.toUpperCase()}
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                {t('logOut')}
              </DropdownItem>
            </DropdownMenu>
          )}
        </div>
      </RightSection>
    </Navbar>
  );
};

ProjectNavbar.propTypes = propTypes;
ProjectNavbar.defaultProps = defaultProps;

export default ProjectNavbar;