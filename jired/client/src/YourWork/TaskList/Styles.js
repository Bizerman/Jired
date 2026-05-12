import styled from 'styled-components';
import { Avatar } from 'shared/components';
import { color } from 'shared/utils/styles';

export const TaskListContainer = styled.div`
  margin-top: 14px;
`;

export const TaskListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F9F8F8;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 16px 20px;
  transition: background 0.15s;
  &:hover {
    background: #F0ECEC;
  }
`;

export const TaskItemTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
  margin-bottom: 4px;
`;

export const TaskItemMeta = styled.div`
  font-size: 14px;
  color: #866f6f;
  font-family: 'Outfit', sans-serif;
`;

export const TaskLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
  min-width: 0;
`;

export const TaskIconBox = styled.div`
  display: flex;
  width: 2.2rem;
  height: 2.2rem;
  padding: 0.5rem 0.35rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 4px;
  background: ${color.primary};
  flex-shrink: 0;
`;

export const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
  min-width: 0;
`;

export const TaskRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

export const AvatarPic = styled(Avatar)`
  width: 2rem;
  height: 2rem;
`;

export const CreatorName = styled.span`
  font-size: 0.75rem;
  color: #866f6f;
  font-family: 'Outfit', sans-serif;
  white-space: nowrap;
`;

export const EmptyTasksMessage = styled.div`
  padding: 16px;
  color: #7e7e7e;
`;