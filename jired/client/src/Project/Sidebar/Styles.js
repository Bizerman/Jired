import styled from 'styled-components';
import { color, sizes, font, mixin, zIndexValues } from 'shared/utils/styles';

const SCALE = 1.25;

export const Sidebar = styled.div`
  position: fixed;
  z-index: ${zIndexValues.navbar - 1};
  top: ${sizes.appNavBarTopHeight * SCALE}px;
  left: 0;
  height: calc(100vh - ${sizes.appNavBarTopHeight * SCALE}px);
  width: ${(sizes.secondarySideBarWidth + 80) * SCALE}px;
  padding: ${30 * SCALE}px ${22 * SCALE}px ${30 * SCALE}px ${22 * SCALE}px;
  background: #fff;
  border-right: 1px solid ${color.borderLightest};
  ${mixin.scrollableY}
  ${mixin.customScrollbar()}
  @media (max-width: 999px) {
    display: none;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${14 * SCALE}px;
`;

export const SectionTitle = styled.div`
  ${font.medium}
  font-size: ${16 * SCALE}px;
  color: #3d2424;
`;

export const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${12 * SCALE}px;
  padding: ${6 * SCALE}px;
  border-radius: ${6 * SCALE}px;
  background: ${color.backgroundLightest};
  margin-bottom: ${10 * SCALE}px;
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLight};
  }
`;

export const ProjectIconBox = styled.div`
  width: ${30 * SCALE}px;
  height: ${30 * SCALE}px;
  border-radius: ${4 * SCALE}px;
  background: ${props => props.bg || color.backgroundMedium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ProjectTexts = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const ProjectName = styled.div`
  ${font.medium}
  font-size: ${14 * SCALE}px;
  color: ${color.textMedium};
  ${mixin.truncateText}
`;

export const ProjectCategory = styled.div`
  ${font.regular}
  font-size: ${12 * SCALE}px;
  color: ${color.textMedium};
`;

export const ViewAllLink = styled.div`
  ${font.regular}
  font-size: ${12 * SCALE}px;
  color: ${color.textMedium};
  ${mixin.clickable}
  padding: 15px;
  &:hover {
    color: ${color.textMedium};
    text-decoration: underline;
  }
`;

export const Divider = styled.div`
  margin-top: ${20 * SCALE}px;
  padding-top: ${20 * SCALE}px;
  border-top: 1px solid ${color.borderLightest};
`;

export const LinkItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${8 * SCALE}px ${10 * SCALE}px;
  border-radius: ${5 * SCALE}px;
  ${mixin.clickable}
  ${props =>
    !props.to
      ? `cursor: not-allowed;`
      : `&:hover { background: ${color.backgroundLightest}; }`}
  i {
    margin-right: ${12 * SCALE}px;
    font-size: ${18 * SCALE}px;
    color: ${color.textMedium};
  }
  &.active {
    background: ${color.backgroundLightPrimary};
    i { color: ${color.primary}; }
  }
`;

export const LinkText = styled.div`
  ${font.regular}
  font-size: ${14 * SCALE}px;
  color: ${color.textMedium};
  padding-top: 1px;
  ${LinkItem}.active & {
    color: ${color.primary};
    ${font.medium}
  }
`;

export const NotImplemented = styled.div`
  display: inline-block;
  position: absolute;
  top: ${7 * SCALE}px;
  left: ${40 * SCALE}px;
  width: ${140 * SCALE}px;
  padding: ${5 * SCALE}px 0 ${5 * SCALE}px ${8 * SCALE}px;
  border-radius: ${3 * SCALE}px;
  text-transform: uppercase;
  color: ${color.textMedium};
  background: ${color.backgroundLight};
  opacity: 0;
  font-size: ${11.5 * SCALE}px;
  ${font.bold}
  ${LinkItem}:hover & {
    opacity: 1;
  }
`;
export const PlusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #ECECEC;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  padding: 0;                   
  transition: background 0.1s;

  &:hover {
    background: #E0E0E0;
  }

  i {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    margin: 0;                   
  }
`;
export const RecentButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  padding: 6px 0;
  margin: 12px 0 8px;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: ${12 * SCALE * 1.05}px;
  color: ${color.textMedium};
  transition: color 0.1s;

  &:hover {
    color: ${color.textDark};
    /* убираем общее подчёркивание */
    text-decoration: none;
  }

  i {
    text-decoration: none;
    font-size: 18px;
    line-height: 1;
  }

  span {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
export const RecentDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  list-style: none;
  padding: 4px 0;
  min-width: 180px;
  z-index: 101;
`;

export const RecentDropdownItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  color: ${color.textMedium};
  cursor: pointer;
  transition: background 0.1s;
  background: ${props => props.isCurrentProject ? '#F4F5F7' : 'transparent'};

  &:hover {
    background: ${color.backgroundLight};
  }
`;
