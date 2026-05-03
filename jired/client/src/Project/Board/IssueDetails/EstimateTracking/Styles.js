import styled from 'styled-components';

// Figma: "Time tracking" row — 14px, color #866f6f; modal kept clean
export const TrackingLink = styled.div`
  padding: 4px 6px 4px 4px;
  border-radius: 5px;
  transition: background 0.1s;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: #4a2727;
  &:hover {
    background: #ebe7e7;
  }
`;

export const ModalContents = styled.div`
  padding: 20px 25px 25px;
  font-family: 'Outfit', sans-serif;
`;

export const ModalTitle = styled.div`
  padding-bottom: 14px;
  font-weight: 600;
  font-size: 20px;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
`;

export const Inputs = styled.div`
  display: flex;
  margin: 20px -5px 30px;
`;

export const InputCont = styled.div`
  margin: 0 5px;
  width: 50%;
`;

export const InputLabel = styled.div`
  padding-bottom: 5px;
  color: #725757;
  font-weight: 500;
  font-size: 13px;
  font-family: 'Outfit', sans-serif;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
`;
