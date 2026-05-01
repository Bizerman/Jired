import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { IssueTypeIcon, IssuePriorityIcon } from 'shared/components';
import { Icon } from 'shared/components';
import { Link } from 'react-router-dom';
import BellIcon from 'shared/components/Bell';
import gridicon from '../../App/assets/imgs/fi-sr-grid.svg';
import useApi from 'shared/hooks/api';
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

  const handleTaskClick = (issueId) => {
    history.push(`/project/board/issues/${issueId}`);
    setHoveredDropdown(null);
  };

  const handleYourWorkClick = (destination) => {
  history.push(`/your-work?tab=${destination}`);
  setHoveredDropdown(null);
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
                <NavItemPrimary>Your work</NavItemPrimary>
              </Link>
              <Icon size={20} type="chevron-down" />
            </NavItemBox>
            {hoveredDropdown === 'your-work' && (
              <DropdownMenu onMouseEnter={keepDropdownOpen}>
                <DropdownItem onClick={() => handleYourWorkClick('worked-on')}>
                  Worked on
                </DropdownItem>
                <DropdownItem onClick={() => handleYourWorkClick('viewed')}>
                  Viewed
                </DropdownItem>
                <DropdownItem onClick={() => handleYourWorkClick('starred')}>
                  Starred
                </DropdownItem>
              </DropdownMenu>
            )}
          </DropdownWrapper>

          {/* Assigned to me */}
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
              <NavItem>Assigned to me</NavItem>
              <Icon size={20} type="chevron-down" />
            </NavItemBox>
            {hoveredDropdown === 'tasks' && (
              <DropdownMenu onMouseEnter={keepDropdownOpen}>
                {currentUser ? (
                  tasksList.length ? (
                    tasksList.map(issue => (
                      <DropdownItem key={issue.id} onClick={() => handleTaskClick(issue.id)}>
                        <IssueTypeIcon type={issue.type} size={16} />
                        <IssuePriorityIcon priority={issue.priority} size={16} />
                        <IssueKey>LP-{issue.id}</IssueKey>
                        <IssueTitle>{issue.title}</IssueTitle>
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem>No tasks assigned</DropdownItem>
                  )
                ) : (
                  <DropdownItem>Loading...</DropdownItem>
                )}
              </DropdownMenu>
            )}
          </DropdownWrapper>

          <CreateButton onClick={issueCreateModalOpen}>Create</CreateButton>
        </NavItems>
      </LeftSection>

      <SearchContainer>
        <Icon type="search" size={20} />
        <SearchInput
          placeholder="Search"
          onClick={issueSearchModalOpen}
          readOnly
        />
      </SearchContainer>

      <RightSection>
        <IconBtn title="Notifications">
          <BellIcon size={25} color="currentColor" />
        </IconBtn>
        <IconBtn title="Help">
          <Icon type="help" size={20} />
        </IconBtn>
        <IconBtn title="Settings">
          <Icon type="settings" size={20} />
        </IconBtn>
        <UserAvatar title="Profile">{initials}</UserAvatar>
      </RightSection>
    </Navbar>
  );
};

ProjectNavbar.propTypes = propTypes;
ProjectNavbar.defaultProps = defaultProps;

export default ProjectNavbar;