import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 275px;   /* 220 * 1.25 */
  max-width: 325px;   /* 260 * 1.25 */
  min-height: 500px;  /* 400 * 1.25 */
  border-radius: 10px; /* 8 * 1.25 */
  background: ${color.backgroundLightest};
  padding: 15px 7.5px; /* 12 * 1.25, 6 * 1.25 */
  transition: background 0.2s ease, box-shadow 0.2s ease;
  ${props => props.isDraggingOver && `
    background: ${color.primary}15;          /* полупрозрачный акцентный цвет */
    box-shadow: 0 0 0 2px ${color.primary};  /* обводка */
  `}
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;          /* 8 * 1.25 */
  padding: 0 7.5px 15px; /* 6 * 1.25, 12 * 1.25 */
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2.5px 10px; /* 2 * 1.25, 8 * 1.25 */
  border-radius: 6.25px; /* 5 * 1.25 */
  background: ${props => props.bg || '#f0ebeb'};
  color: ${props => props.textColor || color.textMedium};
  ${font.bold}
  font-size: 12.5px;    /* 10 * 1.25 */
  text-transform: uppercase;
  letter-spacing: 0.375px; /* 0.3 * 1.25 */
`;

export const IssuesCount = styled.span`
  ${font.medium}
  font-size: 17.5px;    /* 14 * 1.25 */
  color: #3d2424;
`;

export const Issues = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  /* Стилизуем стандартный плейсхолдер react-beautiful-dnd */
  & > .react-beautiful-dnd-placeholder {
    height: 78px;
    margin: 5px 0;
    border-radius: 6px;
    background: ${color.primary}18;
    border: 2px dashed ${color.primary};
    box-shadow: inset 0 0 12px ${color.primary}10;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  /* Если класс не применился, стилизуем last-child на случай, если placeholder попадёт в конец */
  & > div:last-child {
    /* Это запасной вариант, можно оставить пустым */
  }
`;
export const FadeWrapper = styled.div`
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: ${p => p.visible ? 1 : 0};
  transform: ${p => p.visible ? 'scale(1)' : 'scale(0.95)'};
  pointer-events: ${p => p.visible ? 'auto' : 'none'};
`;
export const DragPlaceholder = styled.div`
  height: 78px;
  margin: 5px 0;
  border-radius: 6px;
  background: ${color.primary}18;
  border: 2px dashed ${color.primary};
  box-shadow: inset 0 0 12px ${color.primary}10;
`;