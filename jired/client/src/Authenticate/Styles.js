import styled from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 65px;
  box-sizing: border-box;
  ${font.regular}
`;

export const Card = styled.div`
  width: 351px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LogoImage = styled.img`
  width: 43px;
  height: 43px;
  object-fit: contain;
`;

export const AppTitle = styled.span`
  font-size: 24px;
  font-weight: 500;
  color: #3d2424;
`;

export const VerificationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #4a2727;
`;

export const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 26px;
  text-align: center;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #360f0f;
  ${font.medium}
`;

export const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #5f5f5f;
  text-align: left;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid ${color.primary};
  padding: 12px 20px;
  gap: 10px;
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: 'Outfit', sans-serif;
  color: #3f3f3f;
  background: transparent;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SubmitButton = styled.button`
  padding: 8px 20px;
  background-color: ${color.primary};
  border-radius: 5px;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  ${mixin.clickable}
`;

export const Hint = styled.div`
  font-size: 12px;
  color: #725757;
  text-align: center;
`;

export const CheckingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  ${font.regular}
`;

export const LangToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: 1px solid ${color.borderLight};
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 14px;
  color: ${color.textDark};
`;