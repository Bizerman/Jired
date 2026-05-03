import styled, { css } from 'styled-components';
import { mixin } from 'shared/utils/styles';

// Figma: Assignee row — avatar circle (#360f0f), "Unassigned" + "Assign to me" link
export const User = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  ${props =>
    props.isSelectValue &&
    css`
      padding: 4px 6px;
      border-radius: 5px;
      background: #ebe7e7;
      transition: background 0.1s;
      &:hover {
        background: #e0d8d8;
      }
    `}
`;

export const Username = styled.div`
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  color: #4a2727;
  padding: 0 3px 0 4px;
`;
