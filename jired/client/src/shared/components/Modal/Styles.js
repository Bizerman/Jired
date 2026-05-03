import styled, { css } from 'styled-components';
import { color, mixin, zIndexValues } from 'shared/utils/styles';
import Icon from 'shared/components/Icon';

export const ScrollOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${zIndexValues.modal};
  background: rgba(0, 0, 0, 0.3);
  overflow: auto;   /* ← меняем scroll на auto */
  /* Скрываем полосы прокрутки (по желанию) */
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none; /* Firefox */
  ${props => props.variant === 'search' && `
    background: rgba(0, 0, 0, 0.5);
    overflow: hidden;
  `}
`;

export const ClickableOverlay = styled.div`
  ${props => props.variant !== 'search' && `
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100%;
    padding: 50px;
  `}
  ${props => props.variant === 'search' && `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  `}
`;

export const StyledModal = styled.div`
  display: inline-block;
  position: relative;
  background: #fff;
  vertical-align: middle;
  text-align: left;
  ${props => props.variant && modalStyles[props.variant]}
  ${props => props.variant === 'search' && css`
    position: relative;
    width: 100%;
    max-width: 90vw;
    width: ${props => {
    if (typeof props.width === 'number') return `${props.width}px`;
    return props.width; // строка, например '80vw'
  }};
    margin: ${props.topOffset}px auto 0 auto;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 0 0 8px 8px;
  `}
`;

const modalStyles = {
  center: css`
    width: ${props => {
      if (typeof props.width === 'number') return `${props.width}px`;
      return props.width;           // теперь width, а не max-width
    }};
    max-width: 90vw;
    overflow-y: auto;                /* страховка, чтобы окно не вылезало */
    vertical-align: middle;
    border-radius: 3px;
    ${mixin.boxShadowMedium}
  `,
  aside: css`
    min-height: 100vh;
    width: ${props => {
      if (typeof props.width === 'number') return `${props.width}px`;
      return props.width;
    }};
    max-width: 90vw;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  `,
};

export const CloseIcon = styled(Icon)`
  position: absolute;
  font-size: 25px;
  color: ${color.textMedium};
  transition: all 0.1s;
  ${mixin.clickable}
  ${props => closeIconStyles[props.variant]}
`;

const closeIconStyles = {
  center: css`
    top: 10px;
    right: 12px;
    padding: 3px 5px 0px 5px;
    border-radius: 4px;
    &:hover {
      background: ${color.backgroundLight};
    }
  `,
  aside: css`
    top: 10px;
    right: -30px;
    width: 50px;
    height: 50px;
    padding-top: 10px;
    border-radius: 3px;
    text-align: center;
    background: #fff;
    border: 1px solid ${color.borderLightest};
    ${mixin.boxShadowMedium};
    &:hover {
      color: ${color.primary};
    }
  `,
};