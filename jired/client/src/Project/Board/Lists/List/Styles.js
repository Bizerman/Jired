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
  gap: 5px;             /* 4 * 1.25 */
`;
export const FadeWrapper = styled.div`
  transition: opacity 0.2s ease, transform 0.2s ease;
  opacity: ${p => p.visible ? 1 : 0};
  transform: ${p => p.visible ? 'scale(1)' : 'scale(0.95)'};
  pointer-events: ${p => p.visible ? 'auto' : 'none'};
`;