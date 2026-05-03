import styled, { css } from 'styled-components';
import { issueStatusColors, issueStatusBackgroundColors, mixin } from 'shared/utils/styles';

// Figma: status button — border-radius 5px, bg #ececec, text #3f3f3f, 14px/500
export const Status = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 5px;
  background-color: #ececec;
  padding: 8px 16px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #3f3f3f;
  text-transform: none;
  transition: background 0.1s, transform 0.1s;
  ${props => mixin.tag(issueStatusBackgroundColors[props.color], issueStatusColors[props.color])}
  ${props =>
    props.isValue &&
    css`
      cursor: pointer;
      &:hover {
        transform: scale(1.04);
        background-color: #e0d8d8;
      }
    `}
`;
