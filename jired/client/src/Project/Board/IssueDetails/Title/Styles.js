import styled from 'styled-components';
import { Textarea } from 'shared/components';

// Figma: title is 24px, font-weight 600, color #4a2727, font Outfit
export const TitleTextarea = styled(Textarea)`
  margin: 0 0 0 -8px;
  width: 100%;
  textarea {
    padding: 7px 7px 8px;
    line-height: 1.3;
    border: none;
    resize: none;
    background: transparent;
    border: 1px solid transparent;
    box-shadow: 0 0 0 1px transparent;
    transition: background 0.1s, border-color 0.1s;
    font-family: 'Outfit', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #4a2727;
    &:hover:not(:focus) {
      background: #ebe7e7;
      border-color: #ececec;
    }
    &:focus {
      border-color: #c0afaf;
      background: #fff;
    }
    &::placeholder {
      color: #866f6f;
      font-weight: 400;
    }
  }
`;

export const ErrorText = styled.div`
  padding-top: 4px;
  color: #ad1e1e;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
`;
