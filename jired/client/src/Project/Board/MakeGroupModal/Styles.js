import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';
import { Avatar } from 'shared/components';

// ----- контейнеры и карточки групп -----
export const GroupsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  grid-auto-flow: column;
  width: 100%;
`;

export const GroupCard = styled.div`
  background: #F9F8F8;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const GroupTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #4a2727;
  margin-bottom: 12px;
`;

export const TaskList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// ----- карточка задачи (как на канбане) -----
export const CardWrapper = styled.div`
  padding: 10px 12px;
  border-radius: 5px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  cursor: grab;
  margin-bottom: 8px;
  &:hover {
    background: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  &:active {
    cursor: grabbing;
  }
`;

export const Title = styled.p`
  ${font.regular}
  font-size: 15px;
  color: ${color.textMedium};
  padding-bottom: 8px;
  text-align: left;
  line-height: 1.4;
`;

export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IssueId = styled.div`
  ${font.regular}
  font-size: 13px;
  color: ${color.textMedium};
`;

export const Assignees = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-left: 2px;
`;

export const AssigneeAvatar = styled(Avatar)`
  margin-left: -2px;
  box-shadow: 0 0 0 2px #fff;
`;

export const PriorityIcon = styled.img`
  width: 1rem;
  height: 1rem;
`;

// ----- элементы модального окна (убираем инлайн-стили) -----
export const ModalWrapper = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #F0ECEC;
`;

export const TitleHeader = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #4a2727;
`;

export const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #866f6f;
`;

export const Body = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  justify-content:center;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #F0ECEC;
`;

export const Loader = styled.div`
  text-align: center;
  padding: 40px;
`;

export const ErrorMsg = styled.div`
  text-align: center;
  padding: 40px;
  color: #ff4d4f;
`;