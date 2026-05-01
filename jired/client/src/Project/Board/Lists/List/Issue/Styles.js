import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { color, font, mixin } from 'shared/utils/styles';
import { Avatar } from 'shared/components';

export const IssueLink = styled(Link)`
  display: block;
  margin-bottom: 5px;   /* 4 * 1.25 */
  text-decoration: none;
`;

export const Issue = styled.div`
  padding: 12.5px 13.75px; /* 10 * 1.25, 11 * 1.25 */
  border-radius: 5px;      /* 4 * 1.25 */
  background: #fff;
  border: 1px solid ${color.borderLightest};
  transition: box-shadow 0.15s, border-color 0.15s;
  ${mixin.clickable}
  &:hover {
    border-color: ${color.borderLight};
    box-shadow: 0 2.5px 10px rgba(173, 30, 30, 0.08); /* 2 * 1.25, 8 * 1.25 */
  }
  ${props =>
    props.isBeingDragged &&
    css`
      transform: rotate(2deg);
      box-shadow: 0 10px 30px rgba(173, 30, 30, 0.15); /* 8 * 1.25, 24 * 1.25 */
      border-color: ${color.primary};
    `}
`;

export const Title = styled.p`
  ${font.regular}
  font-size: 17.5px;       /* 14 * 1.25 */
  color: ${color.textDark};
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