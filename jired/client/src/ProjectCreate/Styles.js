import styled from 'styled-components';
import { color, font } from 'shared/utils/styles';

// ─── Page shell ─────────────────────────────────────────────────────────────
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 0;
  ${font.regular}
`;

export const TopBar = styled.div`
  padding: 1.625rem 1.9375rem 0;  /* 26px 31px 0 */
`;

export const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;  /* 8px */
  background: none;
  border: 1px solid #ececec;
  border-radius: 0.375rem;  /* 6px */
  padding: 0.5rem 1.125rem;  /* 8px 18px */
  ${font.medium}
  font-size: 1.0625rem;  /* 17px */
  color: #5f5f5f;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  &:hover {
    border-color: #c0afaf;
    color: #360f0f;
  }
  i {
    font-size: 1.125rem;  /* 18px */
  }
`;

// ─── Two‑panel layout ────────────────────────────────────────────────────────
export const MainContainer = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20%;
  padding: 3.25rem 3.875rem 6.5rem;  /* 52px 62px 104px */
  flex: 1;

  @media (max-width: 1100px) {
    gap: 4.0625rem;  /* 65px */
    padding: 2.4375rem 2.625rem 4.875rem;  /* 39px 42px 78px */
  }
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 3.25rem;  /* 52px */
    padding: 1.9375rem 1.9375rem 4.875rem;  /* 31px 31px 78px */
  }
`;

// ─── Left panel ──────────────────────────────────────────────────────────────
export const LeftPanel = styled.section`
  width: 28.4375rem;  /* 455px */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2.4375rem;  /* 39px */
  padding: 1.625rem 0;  /* 26px 0 */
  @media (max-width: 900px) {
    width: 100%;
    max-width: 36.5625rem;  /* 585px */
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;  /* 16px */
`;

export const Title = styled.h3`
  margin: 0;
  ${font.bold}
  font-size: 1.9375rem;  /* 31px */
  color: #360f0f;
  @media (max-width: 450px) {
    font-size: 1.5625rem;  /* 25px */
  }
`;

export const DescriptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.625rem;  /* 26px */
`;

export const DescText = styled.p`
  margin: 0;
  ${font.regular}
  font-size: 1.125rem;  /* 18px */
  color: #725757;
  line-height: 1.5;
`;

export const RequiredNote = styled.p`
  margin: 0;
  ${font.regular}
  font-size: 1.125rem;  /* 18px */
  color: #725757;
`;

export const Asterisk = styled.span`
  color: #da2d20;
`;

// ─── Form section ────────────────────────────────────────────────────────────
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4375rem;  /* 39px */
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.625rem;  /* 26px */
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  display: block;
  ${font.medium}
  font-size: 1rem;  /* 16px */
  color: #5f5f5f;
  margin-bottom: 0.5rem;  /* 8px */
`;

export const StyledInput = styled.input`
  width: 100%;
  ${font.regular}
  font-size: 1.3125rem;  /* 21px */
  color: #3f3f3f;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 0.5rem;  /* 8px */
  padding: 1rem 1.625rem;  /* 16px 26px */
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder {
    color: #b5b5b5;
  }
  &:focus {
    border-color: #ad1e1e;
    box-shadow: 0 0 0 0.25rem rgba(173, 30, 30, 0.08);  /* 4px */
  }
`;

export const KeyField = styled.div`
  width: 11.75rem;  /* 188px */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;  /* 8px */
`;

export const KeyInput = styled.input`
  width: 100%;
  ${font.medium}
  font-size: 1.3125rem;  /* 21px */
  color: #3f3f3f;
  text-transform: uppercase;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 0.5rem;  /* 8px */
  padding: 0.8125rem 1.5625rem;  /* 13px 25px */
  outline: none;
  transition: border-color 0.15s;
  letter-spacing: 0.040625rem;  /* 0.65px */
  &::placeholder {
    color: #b5b5b5;
    ${font.regular}
    text-transform: none;
    letter-spacing: 0;
  }
  &:focus {
    border-color: #ad1e1e;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  ${font.regular}
  font-size: 1.3125rem;  /* 21px */
  color: #3f3f3f;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 0.5rem;  /* 8px */
  padding: 1rem 1.625rem;  /* 16px 26px */
  outline: none;
  appearance: none;
  transition: border-color 0.15s;
  cursor: pointer;
  &:focus {
    border-color: #ad1e1e;
  }
`;

// ─── Submit button ────────────────────────────────────────────────────────────
export const SubmitButton = styled.button`
  align-self: flex-end;
  ${font.medium}
  font-size: 1.125rem;  /* 18px */
  color: #fff;
  background: ${color.primary};
  border: none;
  border-radius: 0.375rem;  /* 6px */
  padding: 0.8125rem 1.9375rem;  /* 13px 31px */
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  &:hover {
    opacity: 0.9;
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ─── Right panel (с фоновой SVG) ─────────────────────────────────────────────
export const RightPanel = styled.section`
  position: relative;
  width: clamp(23.75rem, 45vw, 35%);  /* clamp(380px, 45vw, 35%) */
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5%;
  background-image: url(${props => props.bg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 1100px) {
    width: 32.5rem;  /* 520px */
    padding: 1.9375rem;  /* 31px */
  }
  @media (max-width: 900px) {
    width: 100%;
    max-width: 42.25rem;  /* 676px */
    margin: 0 auto;
  }
`;
export const IconCard = styled.div`
  background: #fff;
  border: 1px solid ${color.borderLightest};
  border-radius: 0.5rem;
  box-shadow: 0 1px 9px rgba(0, 0, 0, 0.09);
  padding: 1rem;
  margin-top: 0.5rem;
`;

export const IconPreview = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 0.5rem;
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
  width: 60%;
  cursor: pointer;
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  border: 1px solid ${color.borderLightest};
  border-radius: 0.25rem;
  background: #fff;
  color: ${color.textMedium};
  &:hover {
    border-color: ${color.borderLight};
    color: ${color.textDark};
  }
`;

export const ColorInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: 1px solid ${color.borderLightest};
  border-radius: 0.25rem;
  background: #fff;
  color: ${color.textMedium};
  &:hover {
    border-color: ${color.borderLight};
    color: ${color.textDark};
  }
`;

export const ColorInput = styled.input`
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  padding: 0;
  cursor: pointer;
  background: transparent;
  &::-webkit-color-swatch-wrapper { padding: 0; }
  &::-webkit-color-swatch {
    border: 1px solid ${color.borderLightest};
    border-radius: 0.25rem;
  }
`;
export const ShowMoreBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #ad1e1e;
  cursor: pointer;
  transition: border-color 0.15s;
  align-self: flex-start;

  &:hover {
    border-color: #ad1e1e;
    /* подчёркивание только у span с текстом */
    span {
      text-decoration: underline;
    }
  }

  i {
    font-size: 16px;
  }
`;