import styled, { css } from 'styled-components';

import { color, font } from 'shared/utils/styles';
import Icon from 'shared/components/Icon';

export const StyledInput = styled.div`
  position: relative;
  display: inline-block;
  height: 40px;
  width: 100%;
`;

export const InputElement = styled.input`
  height: 100%;
  width: 100%;
  padding: 0 8.75px; 
  border-radius: 3.75px; 
  border: 1px solid ${color.borderLightest};
  color: ${color.textDarkest};
  transition: background 0.1s;
  ${font.regular}
  font-size: 18.75px;  
  ${props => props.hasIcon && 'padding-left: 15px;'} 
  &:hover {
    background: ${color.backgroundLight};
  }
  &:focus {
    background: #fff;
    border: 1px solid ${color.borderInputFocus};
    box-shadow: 0 0 0 1.25px ${color.borderInputFocus}; 
  }
  ${props =>
    props.invalid &&
    css`
      &,
      &:focus {
        border: 1px solid ${color.danger};
        box-shadow: none;
      }
    `}
`;

export const StyledIcon = styled(Icon)`
  position: absolute;
  top: 8.75px;
  right: 15px;
  pointer-events: none;
  color: ${color.textMedium};
  font-size: ${props => (props.size || 16) * 1.25}px;
`;
