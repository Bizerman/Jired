import styled, { css } from 'styled-components';

// Figma: priority row — icon + text, 14px, color #725757
export const Priority = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: #4a2727;
  ${props =>
    props.isValue &&
    css`
      padding: 4px 6px 4px 4px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.1s;
      &:hover, &:focus {
        background: #ebe7e7;
      }
    `}
`;

export const Label = styled.div`
  padding: 0 3px 0 4px;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  color: #4a2727;
`;
