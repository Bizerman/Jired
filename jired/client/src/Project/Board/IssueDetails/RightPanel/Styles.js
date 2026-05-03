import styled from 'styled-components';
import { color } from 'shared/utils/styles';

export const RightPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 485px;
  font-family: 'Outfit', sans-serif;
  color: ${color.textDark};
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const AttachButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 5px;
  background: #ebe7e7;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #5e3f3f;
  cursor: pointer;
  img {
    width: 18px;
  }
`;

export const DetailsCard = styled.div`
  border: 1px solid #ececec;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
`;

export const DetailsCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #ececec;
  font-size: 16px;
  font-weight: 500;
  color: #4a2727;
  .gear-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 2px;
  }
  .collapse-btn {
    border: none;
    background: #ebe7e7;
    border-radius: 5px;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    img {
      width: 16px;
    }
  }
`;

export const DetailsCardBody = styled.div`
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DetailField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

export const DetailLabel = styled.span`
  font-size: 14px;
  color: #725757;
  white-space: nowrap;
`;

export const DetailValue = styled.span`
  font-size: 14px;
  color: #866f6f;
  text-align: right;
`;

export const HideEmptyButton = styled.button`
  background: #ebe7e7;
  border: none;
  border-radius: 5px;
  padding: 6px 14px;
  font-size: 12px;
  color: #5e3f3f;
  cursor: pointer;
  align-self: flex-start;
`;

export const Timestamps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #866f6f;
  font-family: 'Outfit', sans-serif;
  margin-top: 8px;
`;

export const StatusButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 5px;
  background: #ebe7e7;
  padding: 8px 16px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #5e3f3f;
  cursor: pointer;
  transition: background 0.1s;
  &:hover {
    background: #dcd5d5;
  }
`;

export const StatusDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 10;
  min-width: 100%;
`;

export const StatusDropdownItem = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  color: #3f3f3f;
  cursor: pointer;
  &:hover {
    background: #f5f0f0;
  }
`;