import styled from 'styled-components';
import { font, color, mixin } from 'shared/utils/styles';
import { Avatar } from 'shared/components';


export const PageWrapper = styled.div`
  margin-top: 6vh;
  padding: 3% 6%;
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
  color: ${color.textmedium};
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
  color: ${color.textmedium};
  margin: 16px 0 2%;
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
  color: ${color.textmedium};
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

export const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  gap: 50px;
  width: 100%;
`;

export const ProjectCard = styled.div`
  display: flex;
  border: 1px solid ${color.borderLightest};
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
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
  padding-top: 24px;
  flex-shrink: 0;
`;

export const AccentBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 2.1rem;
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

export const CardBody = styled.div`
  flex: 1;
  padding: 20px 20px 16px;
  display: flex;
  flex-direction: column;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;                   /* увеличено с 4px */
  margin-bottom: 18px;        /* увеличено с 12px */
`;

export const CardTitle = styled.span`
  font-size: 20px;
  font-weight: 500;
  color: #360f0f;
  ${mixin.truncateText}
  font-family: 'Outfit', sans-serif;
`;

export const CardMeta = styled.span`
  font-size: 15px;
  color: #5e3f3f;
  font-family: 'Outfit', sans-serif;
`;

export const CardDivider = styled.div`
  height: 1px;
  background: ${color.borderLightest};
  margin: 14px 0;             /* увеличено с 10px */
`;

export const CardLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;         /* увеличено с 6px */
`;

export const LinkText = styled.span`
  font-size: 15px;
  color: #5e3f3f;
  font-family: 'Outfit', sans-serif;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const IssueCount = styled.span`
  font-size: 13px;
  background: ${color.backgroundLightest};
  padding: 2px 8px;
  border-radius: 10px;
  color: ${color.textmedium};
  font-weight: 500;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${color.backgroundLightest};
  border-radius: 4px;
  margin: 12px 0 8px;        /* увеличено с 10px 0 6px */
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
  display: flex;
  justify-content: flex-start;
  margin-top: 6px;            /* увеличено с 4px */
`;

export const FooterText = styled.span`
  font-size: 13px;
  color: ${color.textLight};
`;

export const MetaList = styled.div`
  margin: 12px 0;             /* увеличено с 8px */
  display: flex;
  flex-direction: column;
  gap: 8px;                   /* увеличено с 4px */
`;

export const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MetaLabel = styled.span`
  font-size: 13px;
  color: ${color.textLight};
`;

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${color.textmedium};
`;
