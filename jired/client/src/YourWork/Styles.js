import styled from 'styled-components';
import { font, color, mixin } from 'shared/utils/styles';
import { Avatar } from 'shared/components';

export const PageWrapper = styled.div`
  margin-top: 6vh;
  padding: 3% 2%;
  min-height: 94vh;
  background: #fff;
  ${font.regular}
`;

export const MainContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const WorkHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 8px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  color: ${color.textMedium};
  margin: 0;
  ${font.medium}
`;

export const Divider = styled.div`
  margin: 16px 0;
  height: 1px;
  background: ${color.borderLightest};
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 500;
  color: ${color.textMedium};
  margin: 16px 0 1%;
`;

export const TaskTabs = styled.div`
  display: flex;
  gap: 24px;
  margin: 2% 0 0;
  border-bottom: 1px solid ${color.borderLightest};
  padding-bottom: 0;                     
  overflow: visible;
`;

export const Tab = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? color.primary : color.textMedium};
  padding: 4px 0 8px 0;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? color.primary : 'transparent'};
  transition: color 0.1s, border-color 0.1s;
  position: relative;
  z-index: ${props => props.active ? 1 : 0};
  margin-bottom: ${props => props.active ? '-1px' : '0'};
  &:hover {
    color: ${color.primary};
  }
`;

export const TodaySection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
`;

export const EventList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EventItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EventIconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: ${color.primary};
  flex-shrink: 0;
`;

export const EventTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const EventTitleText = styled.span`
  font-size: 16px;
  color: ${color.textMedium};
`;

export const EventMeta = styled.span`
  font-size: 12px;
  color: ${color.textLight};
`;

export const EventCreators = styled.div`
  width: 88px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CreatorBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CreatorLabel = styled.span`
  font-size: 12px;
  color: ${color.textLight};
`;

export const StyledAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
`;

export const ViewAllLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #AD1E1E;
  cursor: pointer;
  line-height: normal;
  ${mixin.clickable}
  &:hover {
    text-decoration: underline;
  }
`;


export const ProjectCard = styled.div`
  display: flex;
  border: 1px solid ${color.borderLightest};
  border-radius: 8px;
  background: #fff;
  overflow: hidden;       // ← добавить
  cursor: pointer;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }
`;

export const LeftAccent = styled.div`
  width: 4rem;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 16px;
  flex-shrink: 0;
`;

export const AccentBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 2.2rem;
  height: 100%;
  background: ${props => props.bg ? props.bg + '20' : '#FEF3F3'};
`;

export const IconWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 44px;
  height: 44px;
  border-radius: 4px;
  background: ${props => props.bg || color.backgroundMedium};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px #fff;
`;


export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  width: 100%;
  grid-auto-rows: max-content;   /* ← каждая строка подстраивается под свой контент */
  align-items: start;             /* ← элементы не растягиваются по высоте */
`;

export const CardBody = styled.div`
  flex: 1;
  padding: 16px 16px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;                /* ← обязательно, чтобы flex-дети могли сжиматься */
  overflow: hidden;           /* ← на всякий случай */
`;
export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  min-width: 0;
`;

export const CardTitle = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #360f0f;
  font-family: 'Outfit', sans-serif;
  display: block; 
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardMeta = styled.span`
  font-size: 14px;
  color: #5e3f3f;
  font-family: 'Outfit', sans-serif;
`;

export const CardDivider = styled.div`
  height: 1px;
  background: ${color.borderLightest};
  margin: 10px 0;
`;

export const CardLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  min-width: 0;
  gap: 8px;                  /* небольшой зазор между текстом и счётчиком */
  flex-wrap: nowrap;         /* запрещаем перенос */
`;

export const LinkText = styled.span`
  font-size: 14px;
  color: #5e3f3f;
  font-family: 'Outfit', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  flex: 1;                   /* текст занимает доступное место, но может обрезаться */
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const IssueCount = styled.span`
  font-size: 12px;
  background: ${color.backgroundLightest};
  padding: 2px 8px;
  border-radius: 10px;
  color: ${color.textMedium};
  font-weight: 500;
  flex-shrink: 0;            /* счётчик никогда не сжимается */
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${color.backgroundLightest};
  border-radius: 3px;
  margin: 8px 0 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  width: ${props => props.width || 0}%;
  height: 100%;
  background: ${color.primary};
  border-radius: 3px;
  transition: width 0.2s;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 4px;
`;

export const FooterText = styled.span`
  font-size: 12px;
  color: ${color.textLight};
`;

export const MetaList = styled.div`
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MetaLabel = styled.span`
  font-size: 12px;
  color: ${color.textLight};
`;

export const MetaValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${color.textMedium};
`;
export const ProjectCardCreate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${color.borderLightest};
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  gap: 12px;

  &:hover {
    border-color: ${color.primary};
    background: ${color.backgroundLightest};
  }
  grid-auto-rows: max-content;
  height: 100%;
`;

export const TaskListContainer = styled.div`
  margin-top: 14px;
`;

export const TaskListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.1s;
  margin-bottom: 10px;
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
`;

export const TaskItemTitle = styled.div`
  font-size: 16px;
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

export const TaskItemProject = styled.div`
  font-size: 12px;
  color: #5e3f3f;
  font-family: 'Outfit', sans-serif;
  text-align: right;
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