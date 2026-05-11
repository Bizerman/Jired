import styled from 'styled-components';
import { color, font } from 'shared/utils/styles';

export const Container = styled.div`
  margin-top: 20px;
`;

export const TableWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${color.borderLightest};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  ${font.regular}
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 18px;
  background: #F9F8F8;
  border-bottom: 1px solid ${color.borderLight};
  color: #866f6f;
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
`;

export const Td = styled.td`
  padding: 12px 18px;
  border-bottom: 1px solid ${color.borderLightest};
  color: #4a2727;
  vertical-align: middle;
  font-family: 'Outfit', sans-serif;

  tr:last-child & {
    border-bottom: none;
  }

  /* последний столбец – под размер иконок */
  &:last-child {
    width: 1%;
    white-space: nowrap;
    text-align: right;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.1s;

  &:hover {
    background: #F0ECEC;
  }

  & + & {
    margin-left: 4px;
  }
`;

export const DownloadButton = styled(ActionButton)`
  color: ${color.primary};
  margin-right: 12px;   /* ← увеличенный отступ от корзины */
`;

export const DeleteButton = styled(ActionButton)`
  color: #AD1E1E;
`;

export const ModalContent = styled.div`
  padding: 4px 0;
`;

export const ModalText = styled.p`
  font-size: 15px;
  color: #4a2727;
  font-family: 'Outfit', sans-serif;
  line-height: 1.5;
  margin: 0 0 24px;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

export const CancelBtn = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid ${color.borderLight};
  background: #F9F8F8;
  color: #5e3f3f;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;

  &:hover {
    background: #F0ECEC;
  }
`;

export const DeleteBtn = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: #fde8e8;
  color: #AD1E1E;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;

  &:hover {
    background: #f9c4c4;
  }
`;

export const Empty = styled.div`
  text-align: center;
  padding: 60px 40px;
  color: #866f6f;
  font-size: 15px;
  font-family: 'Outfit', sans-serif;
  background: #F9F8F8;
  border-radius: 12px;
`;

export const IssueLink = styled.span`
  color: #866f6f;
  font-size: 13px;
`;
export const DeleteModalContent = styled.div`
  padding: 40px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 12px;
  overflow: hidden;
`;

export const DeleteModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${color.textDark};
  margin: 0 0 20px;
  ${font.bold}
`;

export const DeleteModalMessage = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${color.textMedium};
  margin: 0 0 40px;
  max-width: 420px;
  ${font.regular}
  strong {
    font-weight: 600;
    color: ${color.textDark};
  }
`;

export const DeleteModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
`;

export const DeleteModalCancelButton = styled.button`
  flex: 1;
  max-width: 140px;
  padding: 10px 0;
  border-radius: 8px;
  border: 1px solid ${color.borderLight};
  background: #fff;
  color: ${color.textDark};
  font-size: 14px;
  font-weight: 500;
  ${font.medium}
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &:hover { background: ${color.backgroundLight}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const DeleteModalConfirmButton = styled.button`
  flex: 1;
  max-width: 180px;
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  background: #D92D20;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  ${font.medium}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  &:hover:not(:disabled) {
    background: #B42318;
    box-shadow: 0 4px 12px rgba(217, 45, 32, 0.3);
  }
  &:active:not(:disabled) { transform: scale(0.97); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;