import styled from 'styled-components';

// Figma: "Description" label 16px/500, placeholder text 14px color #725757
export const Title = styled.div`
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #4a2727;
  padding-bottom: 14px;
`;

export const EmptyLabel = styled.div`
  margin-left: -7px;
  padding: 7px;
  border-radius: 5px;
  color: #725757;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  transition: background 0.1s;
  cursor: pointer;
  &:hover {
    background: #ebe7e7;
  }
`;

export const Actions = styled.div`
  display: flex;
  padding-top: 12px;
  gap: 6px;
  & > button {
    font-family: 'Outfit', sans-serif;
    border-radius: 5px;
  }
`;
