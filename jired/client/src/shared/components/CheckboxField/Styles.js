import styled from 'styled-components';
import { font, color } from 'shared/utils/styles';

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  width: fit-content;
`;

export const Checkbox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid ${color.borderLight};
  border-radius: 4px;
  background: ${props => props.checked ? color.primary : '#fff'};
  color: #fff;
  transition: background 0.15s;
  flex-shrink: 0;
`;

export const Checkmark = styled.span`
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  &::before {
    content: '✓';
  }
`;

export const Label = styled.span`
  ${font.regular}
  font-size: 14px;
  color: ${color.textDark};
`;