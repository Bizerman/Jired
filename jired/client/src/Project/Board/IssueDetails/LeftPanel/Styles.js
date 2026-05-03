import styled from 'styled-components';

const f = {
  secondary900: '#4a2727',
  secondary700: '#725757',
  secondary800: '#5e3f3f',
  secondary100: '#ebe7e7',
  greyScale800: '#3f3f3f',
  greyScale100: '#ececec',
  primary1000: '#ad1e1e',
  font: "'Outfit', sans-serif",
};

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5625rem;
  flex: 1;
  font-family: ${f.font};
`;

export const MainBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HeaderBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 1rem;
`;

export const TitleRow = styled.div``;

export const AddChildButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 0.3125rem;
  background: ${f.secondary100};
  border: none;
  cursor: pointer;
  font-family: ${f.font};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${f.greyScale800};
  transition: background 0.1s;
  &:hover {
    background: #dcd5d5;
  }
  width: fit-content;
`;

export const AddChildIcon = styled.span`
  display: inline-flex;
  width: 1.125rem;
  height: 1.125rem;
`;

export const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  flex: 1;               // растягиваем на доступное место
  min-height: 0;          // важно для flex-переполнения
`;
export const DescriptionTitle = styled.div`
  font-family: ${f.font};
  font-size: 1rem;
  font-weight: 500;
  color: ${f.secondary900};
`;

export const ActivitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding-top: 0.5rem;
`;

export const ActivityHeader = styled.div`
  font-family: ${f.font};
  font-size: 1rem;
  font-weight: 500;
  color: ${f.secondary900};
`;

export const ShowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

export const ShowLabel = styled.span`
  font-family: ${f.font};
  font-size: 0.875rem;
  color: ${f.secondary900};
`;

export const FilterButtons = styled.div`
  display: flex;
  gap: 0.625rem;
`;

export const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.625rem;
  border-radius: 0.3125rem;
  border: none;
  background: ${p => p.active ? '#c1afaf' : f.secondary100};
  color: ${p => p.active ? f.primary1000 : f.secondary700};
  font-family: ${f.font};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.1s;
  &:hover {
    background: ${p => p.active ? '#b09e9e' : '#dcd5d5'};
  }
`;

export const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: ${f.font};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${f.secondary800};
  padding: 0;
  margin-left: auto; 
`;

export const CommentBlock = styled.div`
  padding-top: 0;
`;

export const TitleDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
  line-height: 1.3;
  padding: 7px 7px 8px;
`;

export const DescriptionDisplay = styled.div`
  font-size: 0.875rem;
  color: #725757;
  font-family: 'Outfit', sans-serif;
  line-height: 1.5;
  white-space: pre-wrap;
  & * {
    max-width: 100%;
    overflow-wrap: break-word;
  }

`;

export const DescriptionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 2px solid #ececec;
  border-radius: 8px;
  overflow: hidden;
  min-height: 324px;     // минимальная высота, чтобы не схлопывалась
`;

export const RelationsBlock = styled.div`
  margin-top: 1rem;
`;

export const SectionTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
  margin-bottom: 0.5rem;
`;

export const RelationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
`;

export const RelationType = styled.span`
  background: #ebe7e7;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #5e3f3f;
`;
export const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;