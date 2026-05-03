import styled from 'styled-components';
import { color } from 'shared/utils/styles';
// Figma: "Description" label 16px/500, placeholder text 14px color #725757
export const Title = styled.div`
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #4a2727;
  padding-bottom: 14px;
`;

export const EmptyLabel = styled.div`
  margin: 0;
  padding: 0;
  color: #725757;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  transition: background 0.1s;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background: transparent;   /* фон теперь на DescriptionPreview */
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
export const DescriptionPreview = styled.div`
  flex: 1;
  padding: 10px;
  color: ${color.textMedium};
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  border-radius: 0;         /* чтобы совпадало с родительской обводкой */
  transition: background 0.15s;
  &:hover {
    background: #f9f6f6;    /* лёгкий фон при наведении */
  }
`;
export const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;