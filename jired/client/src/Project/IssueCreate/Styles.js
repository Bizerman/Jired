import styled from 'styled-components';
import { font, color, mixin } from 'shared/utils/styles';

export const FormElement = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 2rem 2.5rem;
`;

export const FormHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
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

/* ── Двухколоночный макет (Jira Style) ── */
export const FormLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* Левая колонка шире правой */
  gap: 2.5rem; /* Хороший отступ между колонками */
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const SidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/* Строгий лейбл в стиле Jira */
export const FieldLabel = styled.label`
  display: block;
  ${font.medium}
  font-size: 0.75rem; /* 12px */
  color: #5e6c84; /* Фирменный серый цвет Jira для лейблов */
  margin-bottom: 0.375rem;
`;

// Общий стиль для инпутов (сохранили твою легкую серую заливку, но сделали активную рамку строже)
const inputStyles = `
  width: 100%;
  ${font.regular}
  font-size: 0.875rem; /* 14px */
  color: ${color.textDarkest};
  background: ${color.backgroundLightest};
  border: 2px solid transparent; /* В спокойном состоянии прозрачная граница 2px (чтобы не прыгал размер) */
  border-radius: 4px;
  padding: 0.4375rem 0.75rem;
  outline: none;
  transition: background 0.1s, border-color 0.1s;

  &:hover {
    background: ${color.backgroundLight};
  }

  &:focus {
    background: #fff;
    border-color: ${color.primary};
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
  min-height: 160px; /* В широкой колонке textarea может быть больше */
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 1rem;
  
  > div {
    flex: 1;
    min-width: 0; /* Чтобы инпуты не вылезали за пределы flex-контейнера */
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end; /* Кнопки справа, как в Jira */
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
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
  padding: 0.4375rem 1rem;
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
  padding: 0.4375rem 1rem;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: ${color.backgroundLight};
  }
`;

export const AttachmentZone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1.5rem 1rem;
  border: 2px dashed ${props => props.hasFile ? color.primary : color.borderLightest};
  border-radius: 4px;
  background: ${props => props.hasFile ? color.backgroundLightPrimary : 'transparent'};
  color: ${props => props.hasFile ? color.primary : color.textLight};
  ${font.medium}
  font-size: 0.8125rem; /* 13px */
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${color.backgroundLightest};
    border-color: ${color.borderLight};
    color: ${color.textDark};
  }

  i {
    color: inherit;
  }
`;

export const IconBox = styled.div`
  display: flex;
  width: 1.5rem;          /* 24px */
  height: 1.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: ${color.backgroundDarkPrimary};

  img {
    width: 0.875rem; /* 14px */
    height: 0.875rem;
    flex-shrink: 0;
    aspect-ratio: 1/1;
    filter: brightness(0) invert(1);
  }
`;