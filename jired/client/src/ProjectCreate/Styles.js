import styled from 'styled-components';
import { color, font } from 'shared/utils/styles';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 0;
  ${font.regular}
`;

export const TopBar = styled.div`
  padding: 1.625rem 1.9375rem 0;
`;

export const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #ececec;
  border-radius: 0.375rem;
  padding: 0.5rem 1.125rem;
  ${font.medium}
  font-size: 1.0625rem;
  color: #5f5f5f;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  &:hover {
    border-color: #c0afaf;
    color: #360f0f;
  }
  i {
    font-size: 1.125rem;
  }
`;

export const MainContainer = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20%;
  padding: 3.25rem 3.875rem 6.5rem;
  flex: 1;

  @media (max-width: 1100px) {
    gap: 4.0625rem;
    padding: 2.4375rem 2.625rem 4.875rem;
  }
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 3.25rem;
    padding: 1.9375rem 1.9375rem 4.875rem;
  }
`;

export const LeftPanel = styled.section`
  width: 28.4375rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2.4375rem;
  padding: 1.625rem 0;
  @media (max-width: 900px) {
    width: 100%;
    max-width: 36.5625rem;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Title = styled.h3`
  margin: 0;
  ${font.bold}
  font-size: 1.9375rem;
  color: #360f0f;
  @media (max-width: 450px) {
    font-size: 1.5625rem;
  }
`;

export const DescriptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.625rem;
`;

export const DescText = styled.p`
  margin: 0;
  ${font.regular}
  font-size: 1.125rem;
  color: #725757;
  line-height: 1.5;
`;

export const RequiredNote = styled.p`
  margin: 0;
  ${font.regular}
  font-size: 1.125rem;
  color: #725757;
`;

export const Asterisk = styled.span`
  color: #da2d20;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4375rem;
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.625rem;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  display: block;
  ${font.medium}
  font-size: 1rem;
  color: #5f5f5f;
  margin-bottom: 0.5rem;
`;

export const StyledInput = styled.input`
  width: 100%;
  ${font.regular}
  font-size: 1.3125rem;
  color: #3f3f3f;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 0.5rem;
  padding: 1rem 1.625rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder {
    color: #b5b5b5;
  }
  &:focus {
    border-color: #ad1e1e;
    box-shadow: 0 0 0 0.25rem rgba(173, 30, 30, 0.08);
  }
`;

export const KeyField = styled.div`
  width: 11.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const KeyInput = styled.input`
  width: 100%;
  ${font.medium}
  font-size: 1.3125rem;
  color: #3f3f3f;
  text-transform: uppercase;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 0.5rem;
  padding: 0.8125rem 1.5625rem;
  outline: none;
  transition: border-color 0.15s;
  letter-spacing: 0.040625rem;
  &::placeholder {
    color: #b5b5b5;
    ${font.regular}
    text-transform: none;
    letter-spacing: 0;
  }
  &:focus {
    border-color: #ad1e1e;
  }
  &[readOnly] {
    background: #f9f9f9;
    cursor: pointer;
    user-select: none;
  }
`;

export const RightPanel = styled.section`
  position: relative;
  width: clamp(23.75rem, 45vw, 35%);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5%;
  background-image: url(${require('App/assets/imgs/project-creation.svg').default});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 1100px) {
    width: 32.5rem;
    padding: 1.9375rem;
  }
  @media (max-width: 900px) {
    width: 100%;
    max-width: 42.25rem;
    margin: 0 auto;
  }
`;

export const SubmitButton = styled.button`
  align-self: flex-end;
  ${font.medium}
  font-size: 1.125rem;
  color: #fff;
  background: ${color.primary};
  border: none;
  border-radius: 0.375rem;
  padding: 0.8125rem 1.9375rem;
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
    span {
      text-decoration: underline;
    }
  }

  i {
    font-size: 16px;
  }
`;

export const IconTextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const IconTextContent = styled.div`
  flex: 1;
`;

export const IconTextTitle = styled.p`
  margin: 0;
  font-weight: 600;
  color: #202020;
  font-size: 1rem;
`;

export const IconTextSubtitle = styled.p`
  margin: 4px 0 0;
  color: #7e7e7e;
  font-size: 0.875rem;
`;

export const IconActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

export const BoardImagePreview = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 75%;
  background: url(${require('App/assets/imgs/project-creation-board.svg').default}) center/contain no-repeat;
  pointer-events: none;
  user-select: none;
`;