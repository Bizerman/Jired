import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';

const SCALE = 1.25;

export const Header = styled.div`
  padding-top: ${30 * SCALE}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${12 * SCALE}px;
`;

export const ProjectTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${10 * SCALE}px;
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

export const BoardName = styled.div`
  font-size: ${18 * SCALE}px;
  ${font.medium}
  color: #3d2424;
`;

export const SettingsBtn = styled.button`
  ${font.medium}
  font-size: ${14 * SCALE}px;
  color: ${color.textMedium};
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: ${5 * SCALE}px;
  padding: ${6 * SCALE}px ${14 * SCALE}px;
  ${mixin.clickable}
  display: flex;
  align-items: center;
  gap: ${6 * SCALE}px;
  transition: border-color 0.15s;
  &:hover {
    border-color: ${color.borderLight};
    color: ${color.textDark};
  }
`;