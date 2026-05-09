import styled from 'styled-components';
import { color } from 'shared/utils/styles';

export const ReportsPage = styled.div`
  background: #fff;
  font-family: 'Outfit', sans-serif;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #4a2727;
  margin: 24px 0 16px;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid #F0ECEC;
  padding-bottom: 12px;
`;

export const TabButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${props => props.active ? '#5E3F3F' : 'transparent'};
  background: ${props => props.active ? '#5E3F3F' : '#F9F8F8'};
  color: ${props => props.active ? '#fff' : '#866f6f'};
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#4a2727' : '#F0ECEC'};
  }
`;

export const ChartContainer = styled.div`
  background: #F9F8F8;
  border-radius: 12px;
  padding: 20px;
  margin-top: 12px;
  overflow: hidden;
`;

export const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #866f6f;
  font-size: 14px;
  background: #F9F8F8;
  border-radius: 12px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GanttRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  min-height: 32px;
`;

export const GanttLabel = styled.div`
  width: 200px;
  flex-shrink: 0;
  font-size: 13px;
  color: #5e3f3f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 16px;
`;

export const GanttTimeline = styled.div`
  flex-grow: 1;
  background: #F0ECEC;
  height: 8px;
  border-radius: 4px;
  position: relative;
`;

export const GanttBar = styled.div`
  position: absolute;
  height: 16px;
  top: -4px;
  background: #5E3F3F;
  border-radius: 4px;
  left: ${props => props.left}%;
  width: ${props => props.width}%;
  min-width: 4px;
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background: #4a2727;
  }
`;

export const BarChartWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  height: 250px;
  padding-top: 20px;
  border-bottom: 2px solid #E0D8D8;
`;

export const BarColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

export const BarFill = styled.div`
  width: 60px;
  background: ${props => props.color || '#5E3F3F'};
  height: ${props => props.height}%;
  border-radius: 6px 6px 0 0;
  transition: height 0.5s ease-in-out;
  display: flex;
  justify-content: center;
  padding-top: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;

export const BarLabel = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: #5e3f3f;
  text-align: center;
`;

export const BurndownContainer = styled(ChartContainer)`
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;