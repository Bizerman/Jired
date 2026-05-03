import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { color, font, mixin } from 'shared/utils/styles';
import { Avatar } from 'shared/components';

export const IssueLink = styled(Link)`
  display: block;
  text-decoration: none;
`;

export const Issue = styled.div`
  padding: 12.5px 13.75px;
  border-radius: 5px;
  background: #fff;
  border: 1px solid ${p => p.isSelected ? '#AD1E1E' : color.borderLightest};
  transition: border 0.15s, box-shadow 0.15s;
  ${mixin.clickable}
  &:hover {
    background: ${p => p.isSelected ? 'inherit' : '#f9f9f9'};
    box-shadow: ${p => p.isSelected ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'};
  }
  ${props =>
    props.isBeingDragged &&
    css`
      transform: rotate(2deg);
      box-shadow: 0 10px 30px rgba(173, 30, 30, 0.15);
      border-color: ${color.primary};
    `}
  cursor: pointer;
  margin-bottom: 10px;
`;
export const Title = styled.p`
  ${font.regular}
  font-size: 17.5px;       /* 14 * 1.25 */
  color: ${color.textMedium};
  padding-bottom: 12.5px;  /* 10 * 1.25 */
  text-align: left;
  line-height: 1.4;
`;

export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IssueId = styled.div`
  ${font.regular}
  font-size: 15px;         /* 12 * 1.25 */
  color: ${color.textMedium};
`;

export const Assignees = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-left: 2.5px;      /* 2 * 1.25 */
`;

export const AssigneeAvatar = styled(Avatar)`
  margin-left: -2.5px;     /* -2 * 1.25 */
  box-shadow: 0 0 0 2.5px #fff; /* 2 * 1.25 */
`;

export const MultiDragBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #AD1E1E;
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 10;
`;

export const IssueCheckbox = styled.input`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  opacity: ${p => p.checked ? 1 : 0};
  &:hover { opacity: 1; }
  ${Issue}:hover & { opacity: 1; }
`;

export const PriorityIcon = styled.img`
  color: ${color.primary};
  width: 1rem;
  height: 1rem;
  aspect-ratio: 1/1;
`;