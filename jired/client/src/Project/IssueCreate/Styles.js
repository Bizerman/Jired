import styled from 'styled-components';
import { font, color, mixin } from 'shared/utils/styles'; // Убедись, что путь верный

export const FormElement = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
`;

export const FormHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  
  i {
    color: ${color.textMedium};
  }
`;

export const FormHeading = styled.h2`
  ${font.medium}
  font-size: 1.375rem; /* 22px */
  color: ${color.textDarkest};
  margin: 0;
`;

export const FieldLabel = styled.label`
  display: block;
  ${font.medium}
  font-size: 0.8125rem; /* 13px */
  color: ${color.textMedium};
  margin-bottom: 0.375rem;
`;

// Общий стиль для всех полей ввода
const inputStyles = `
  width: 100%;
  ${font.regular}
  font-size: 0.875rem; /* 14px */
  color: ${color.textDarkest};
  background: ${color.backgroundLightest};
  border: 1px solid ${color.borderLightest};
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: background 0.1s, border-color 0.1s, box-shadow 0.1s;

  &:hover {
    background: ${color.backgroundLight};
  }

  &:focus {
    background: #fff;
    border-color: ${color.primary};
    box-shadow: 0 0 0 1px ${color.primary};
  }

  ${mixin.placeholderColor(color.textLight)}
`;

export const StyledInput = styled.input`
  ${inputStyles}
`;

export const StyledSelect = styled.select`
  ${inputStyles}
  appearance: auto;
  cursor: pointer;
`;

export const StyledTextArea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 110px;
`;

// Компонент для группировки коротких полей в одну строку
export const FieldRow = styled.div`
  display: flex;
  gap: 1rem;
  
  > div {
    flex: 1;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${color.borderLightest};
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  ${font.medium}
  font-size: 0.875rem; /* 14px */
  color: #fff;
  background: ${color.primary};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${mixin.darken(color.primary, 0.1)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  ${font.medium}
  font-size: 0.875rem; /* 14px */
  color: ${color.textDark};
  background: transparent;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${color.backgroundLight};
  }
`;
// Блок для визуализации загрузки файлов (ТЗ требует прикрепления документов)
export const AttachmentZone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: 1px dashed ${props => props.hasFile ? color.primary : color.borderLight};
  border-radius: 4px;
  background: ${props => props.hasFile ? color.backgroundLightPrimary : color.backgroundLightest};
  color: ${props => props.hasFile ? color.primary : color.textLight};
  ${font.medium}
  font-size: 0.8125rem; /* 13px */
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.hasFile ? color.backgroundLightPrimary : color.backgroundLight};
    border-color: ${color.primary};
    color: ${color.primary};
  }

  i {
    color: inherit;
  }
`;

export const IconBox = styled.div`
  display: flex;
  width: 1.5rem;          /* 18px */
  height: 1.5rem;
  padding: 0 0.125rem;      /* 2px */
  justify-content: center;
  align-items: center;
  gap: 0.625rem;            /* 10px */
  border-radius: 0.25rem;   /* 4px */
  background: ${color.backgroundDarkPrimary};

  img {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
    aspect-ratio: 1/1;
    filter: brightness(0) invert(1);
  }
`;

export const CreateStatusDialog = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 12px;
  z-index: 10;
  min-width: 220px;
`;

export const CreateStatusInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid ${color.borderLightest};
  border-radius: 4px;
  outline: none;
  &:focus {
    border-color: ${color.primary};
  }
`;

export const CreateStatusActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;