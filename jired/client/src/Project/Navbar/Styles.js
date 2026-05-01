import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { font, color, mixin, sizes, zIndexValues } from 'shared/utils/styles';
import { Logo } from 'shared/components';


export const Navbar = styled.header`
  z-index: ${zIndexValues.navbar};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 6vh;
  background: #fff;
  border-bottom: 1px solid ${color.borderLightest};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28.75px;
  ${mixin.hardwareAccelerate}
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${sizes.secondarySideBarWidth * 1.25}px; /* можно оставить так или подставить число 287.5, если Width = 230 */
`;

export const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
`;

export const StyledLogo = styled(Logo)`
  display: inline-block;
`;

export const BrandName = styled.span`
  ${font.medium}
  font-size: 22.5px;
  color: #3d2424;
`;

export const NavItems = styled.nav`
  display: flex;
  align-items: center;
  gap: 5rem;
`;

export const NavItemBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8%;
  white-space: nowrap;
  color: ${props => props.primary ? color.primary : color.textMedium};
  ${mixin.clickable}
  padding: 7.5px 5px;
  border-radius: 5px;
  transition: color 0.15s;
  &:hover {
    color: ${props => props.primary ? color.primary : color.textDark};
  }
`;

export const NavItem = styled.div`
  ${font.medium}
  font-size: 17.5px;
  /* цвет теперь задаётся родителем NavItemBox, поэтому здесь не указываем */
`;

export const NavItemPrimary = styled(NavItem)`
  /* тоже без цвета, он идёт от NavItemBox */
`;

export const CreateButton = styled.button`
  ${font.medium}
  font-size: 17.5px;
  color: #fff;
  background: ${color.primary};
  border: none;
  border-radius: 6.25px;
  padding: 7.5px 30px;
  ${mixin.clickable}
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.9;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 15%;
  height: 37.5px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: 6.25px;
  color: ${color.textMedium};
  transition: border-color 0.15s;
  padding: 0 12.5px;
  &:focus-within {
    border-color: ${color.borderInputFocus};
  }
`;

export const SearchInput = styled.input`
  ${font.regular}
  font-size: 17.5px;
  color: ${color.textDark};
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  padding: 0 15px;
  &::placeholder {
    color: ${color.textLight};
  }
`;

export const IconBtn = styled.button`
  background: none;
  border: none;
  padding: 5px;
  ${mixin.clickable}
  color: ${color.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  transition: background 0.1s;
  &:hover {
    background: ${color.backgroundLight};
  }
  i {
    font-size: 25px;
    line-height: 1;
    display: block;
  }
  > * {
    display: block;
  }
`;

export const UserAvatar = styled.div`
  width: 33.75px;
  height: 33.75px;
  border-radius: 50%;
  background: ${color.backgroundMedium};
  display: flex;
  align-items: center;
  justify-content: center;
  ${font.bold}
  font-size: 12.5px;
  color: ${color.secondary};
  ${mixin.clickable}
`;

export const Iconbox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0;
`;

export const GridButton = styled.button`
  background: none;
  border: none;
  padding: 5px;
  margin-right: 10px;
  ${mixin.clickable}
  color: ${color.textMedium};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  transition: background 0.1s;
  &:hover {
    background: ${color.backgroundLight};
  }
  i {
    font-size: 25px;
  }
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
  background: #fff;
  border: 1px solid ${color.borderLight || '#e0e0e0'};
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 180px;
  padding: 4px 0;
  z-index: 1000;
  list-style: none;
`;

export const DropdownItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 17.5px;
  color: ${color.textDark};
  ${mixin.clickable}
  max-width: 320px;          /* ограничение ширины всего пункта */

  &:hover {
    background: ${color.backgroundLight};
  }
`;
export const ProjectNameLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;              /* важно для flex-дочернего элемента, чтобы он мог сжиматься */
`;

export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
export const IssueKey = styled.span`
  color: ${color.textMedium};
  font-size: 12px;
  margin-right: 6px;
  white-space: nowrap;
`;

export const IssueTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const ProjectIconBox = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 4px;
   background: ${props => props.bg || color.backgroundMedium};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
`;