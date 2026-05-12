import styled from 'styled-components';
import { color } from 'shared/utils/styles';

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${props => props.compact ? '8px 14px' : '16px 26px'};
  border: 1px solid ${color.borderLightest};
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  user-select: none;
`;

export const SelectIcon = styled.img`
  width: auto;
  height: auto;
`;

export const SelectLabel = styled.span`
  flex: 1;
  color: #3f3f3f;
  font-size: ${props => props.compact ? '15px' : '1.3125rem'};
`;

export const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: 8px;
  list-style: none;
  padding: 0;
  margin-top: 4px;
  z-index: 10;
`;

export const OptionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${props => props.compact ? '8px 14px' : '12px 20px'};
  cursor: pointer;
  font-size: ${props => props.compact ? '14px' : '1.125rem'};
  transition: background 0.15s;
  &:hover {
    background: #f5f5f5;
  }
`;