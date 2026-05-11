import styled from 'styled-components';
import { font, color } from 'shared/utils/styles';

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