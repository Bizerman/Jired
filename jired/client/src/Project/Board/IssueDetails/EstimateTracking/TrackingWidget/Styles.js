import styled from 'styled-components';
import { Icon } from 'shared/components';

// Figma: time tracking bar — primary accent #ad1e1e, track bg #ececec
export const TrackingWidget = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const WatchIcon = styled(Icon)`
  color: #866f6f;
`;

export const Right = styled.div`
  width: 90%;
`;

export const BarCont = styled.div`
  height: 5px;
  border-radius: 4px;
  background: #ececec;
`;

export const Bar = styled.div`
  height: 5px;
  border-radius: 4px;
  background: #ad1e1e;
  transition: width 0.2s;
  width: ${props => props.width}%;
`;

export const Values = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  font-size: 12px;
  color: #725757;
  font-family: 'Outfit', sans-serif;
`;
