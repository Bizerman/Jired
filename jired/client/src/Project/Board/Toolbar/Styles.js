import styled from 'styled-components';
import { color, font, mixin, zIndexValues } from 'shared/utils/styles';

const SCALE = 1.25;

export const ToolbarContainer = styled.div`
  top: ${54 * SCALE}px; /* высота хедера увеличена */
  z-index: ${zIndexValues.navbar - 1};
  border-bottom: 1px solid ${color.borderLightest};
  padding-top: ${25 * SCALE}px;
  display: flex;
  align-items: center;
`;

export const ToolbarItems = styled.div`
  display: flex;
  align-items: center;
  gap: ${15 * SCALE}px;
  overflow-x: auto;
  ${mixin.scrollableX}
  ${mixin.customScrollbar()}
`;

export const ToolbarItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${8 * SCALE}px;
  padding: ${6 * SCALE}px ${4 * SCALE}px;
  border-radius: ${4 * SCALE}px;
  color: ${color.textMedium};
  ${font.medium}
  font-size: ${14 * SCALE}px;
  ${mixin.clickable}
  transition: color 0.15s, background 0.1s;
  white-space: nowrap;

  &:hover {
    color: ${color.textDark};
    background: ${color.backgroundLight};
  }

  &.active {
    color: ${color.primary};
    i {
      color: ${color.primary};
    }
  }

  i {
    font-size: ${18 * SCALE}px;
  }
`;

export const ItemIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${18 * SCALE}px;
  height: ${18 * SCALE}px;
`;

export const ItemLabel = styled.span`
  ${font.medium}
  font-size: ${14 * SCALE}px;
`;

export const Divider = styled.div`
  width: 1px;
  height: ${20 * SCALE}px;
  background: ${color.borderLight};
  margin: 0 ${8 * SCALE}px;
`;