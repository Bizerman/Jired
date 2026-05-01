import styled from 'styled-components';
import { font, color, mixin } from 'shared/utils/styles';

export const FormCont = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  width: 100%;
`;

export const FormElement = styled.div`
  width: 100%;
  max-width: 640px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: 8px;
  padding: 32px;
  ${mixin.boxShadowMedium}
  ${font.regular}
`;

export const FormHeading = styled.h1`
  margin-top: 12px;
  margin-bottom: 6px;
  font-size: 24px;
  ${font.bold}
  color: #360f0f;
  line-height: 1.3;
`;

export const RequiredNote = styled.p`
  margin: 0;
  ${font.regular}
  font-size: 13px;
  color: #725757;
`;

export const Asterisk = styled.span`
  color: #da2d20;
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  display: block;
  ${font.medium}
  font-size: 14px;
  color: #5f5f5f;
  margin-bottom: 6px;
`;

export const StyledInput = styled.input`
  width: 100%;
  ${font.regular}
  font-size: 15px;
  color: #3f3f3f;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 6px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder {
    color: #b5b5b5;
  }
  &:focus {
    border-color: #ad1e1e;
    box-shadow: 0 0 0 3px rgba(173, 30, 30, 0.08);
  }
`;

export const KeyField = styled.div`
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const KeyInput = styled.input`
  width: 100%;
  ${font.medium}
  font-size: 15px;
  color: #8c8c8c;
  text-transform: uppercase;
  background: #f9f9f9;
  border: 1px solid #ececec;
  border-radius: 6px;
  padding: 10px 14px;
  outline: none;
  letter-spacing: 0.5px;
  cursor: not-allowed;
`;

export const SubmitButton = styled.button`
  ${font.medium}
  font-size: 15px;
  color: #fff;
  background: ${color.primary};
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  &:hover { opacity: 0.9; }
  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const IconCard = styled.div`
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 16px;
`;

export const IconPreview = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  border: 1px solid ${color.borderLightest};
  background: ${props => props.bg || color.backgroundMedium};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

export const UploadLabel = styled.label`
  display: inline-block;
  flex: 1;
  cursor: pointer;
  padding: 8px;
  text-align: center;
  font-size: 13px;
  border: 1px solid ${color.borderLightest};
  border-radius: 4px;
  background: #fff;
  color: ${color.textMedium};
  transition: all 0.1s;
  &:hover { border-color: ${color.borderLight}; color: ${color.textDark}; }
`;

export const ColorInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid ${color.borderLightest};
  border-radius: 4px;
  background: #fff;
  color: ${color.textMedium};
  transition: all 0.1s;
  &:hover { border-color: ${color.borderLight}; color: ${color.textDark}; }
`;

export const ColorInput = styled.input`
  width: 18px;
  height: 18px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: transparent;
  &::-webkit-color-swatch-wrapper { padding: 0; }
  &::-webkit-color-swatch {
    border: 1px solid ${color.borderLightest};
    border-radius: 4px;
  }
`;

export const DeleteButton = styled.button`
  ${font.medium}
  font-size: 15px;
  color: #fff;
  background: #423e3e;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  &:hover { opacity: 0.9; }
  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

// ---------- Обновлённое модальное окно (без анимации, с иконкой trash) ----------

export const DeleteModalContent = styled.div`
  padding: 40px 32px 32px;   /* увеличены отступы */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 12px;       /* скругление контейнера */
  overflow: hidden;          /* чтобы скругление обрезало содержимое */
`;

export const DeleteIconWrapper = styled.div`
  margin-bottom: 20px;
  font-size: 32px;
  color: #D92D20;
  line-height: 1;
`;

export const DeleteModalTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${color.textDark};
  margin: 0 0 20px;          /* увеличен отступ */
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