import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';

export const SummaryPage = styled.div`
  background: #fff;
  font-family: 'Outfit', sans-serif;
`;

export const WorkHeader = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  color: ${color.textMedium};
  margin: 0 0 16px;
  ${font.medium}
`;

export const Divider = styled.div`
  height: 1px;
  background: ${color.borderLightest};
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: ${color.textMedium};
  margin: 24px 0 12px;
`;

export const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 400px;
`;

export const MetaLabel = styled.span`
  font-size: 14px;
  color: #725757;
`;

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #4a2727;
`;

export const ProgressBar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 8px;
  background: ${color.backgroundLightest};
  border-radius: 4px;
  margin: 12px 0 8px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  width: ${props => props.width || 0}%;
  height: 100%;
  background: ${color.primary};
  border-radius: 4px;
  transition: width 0.2s;
`;

export const CardFooter = styled.div`
  margin-top: 4px;
`;

export const FooterText = styled.span`
  font-size: 13px;
  color: #866f6f;
`;

export const TaskListContainer = styled.div`
  margin-top: 12px;
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
  &:hover {
    background: #F0ECEC;
  }
`;

export const TaskLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
  min-width: 0;
`;

export const TaskIconBox = styled.div`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 6px;
  background: ${color.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const TaskItemTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
`;

export const TaskItemMeta = styled.div`
  font-size: 12px;
  color: #866f6f;
  font-family: 'Outfit', sans-serif;
`;

export const TaskRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

export const AvatarPic = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #5E3F3F;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
`;

export const CreatorName = styled.span`
  font-size: 13px;
  color: #5e3f3f;
  font-family: 'Outfit', sans-serif;
  white-space: nowrap;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div`
  background: #F9F8F8;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #4a2727;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #866f6f;
`;