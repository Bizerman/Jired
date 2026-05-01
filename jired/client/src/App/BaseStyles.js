import { createGlobalStyle } from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';

export default createGlobalStyle`
  html, body, #root {
    height: auto;
    min-height: 100%;
    min-width: 768px;
  }

  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background: #f4f4f4;
    color: ${color.textDarkest};
    -webkit-tap-highlight-color: transparent;
    line-height: 1.2;
    ${font.size(16)}
    ${font.regular}
  }

  #root {
    display: flex;
    flex-direction: column;
  }
    :root {
    --GapPadding-6: 6px;
    --GapPadding-8: 8px;
    --GapPadding-10: 10px;
    --GapPadding-12: 12px;
    --GapPadding-14: 14px;
    --GapPadding-16: 16px;
    --GapPadding-20: 20px;
    --GapPadding-26: 26px;
    --GapPadding-30: 30px;
    --GapPadding-40: 40px;
    --Radius-4: 4px;
    --Radius-5: 5px;
    --Radius-50: 50px;
    --Stroke-1: 1px;
    --Black-White-White: #fff;
    --Grey-Scale-100: #ececec;
    --Grey-Scale-600: #7e7e7e;
    --Grey-Scale-700: #5f5f5f;
    --Grey-Scale-800: #3f3f3f;
    --Primary-1000: #ad1e1e;
    --Secondary-600: #866f6f;
    --Secondary-800: #5e3f3f;
    --Secondary-900: #4a2727;
    --Secondary-1000: #360f0f;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    ${font.regular}
  }

  *, *:after, *:before, input[type="search"] {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  ul, li, ol, dd, h1, h2, h3, h4, h5, h6, p {
    padding: 0;
    margin: 0;
  }

  h1, h2, h3, h4, h5, h6, strong {
    ${font.bold}
  }

  button {
    background: none;
    border: none;
  }

  /* Workaround for IE11 focus highlighting for select elements */
  select::-ms-value {
    background: none;
    color: #42413d;
  }

  [role="button"], button, input, select, textarea {
    outline: none;
    &:focus {
      outline: none;
    }
    &:disabled {
      opacity: 1;
    }
  }
  [role="button"], button, input, textarea {
    appearance: none;
  }
  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #000;
  }
  select::-ms-expand {
    display: none;
  }
  select option {
    color: ${color.textDarkest};
  }

  p {
    line-height: 1.4285;
    a {
      ${mixin.link()}
    }
  }

  textarea {
    line-height: 1.4285;
  }

  body, select {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    touch-action: manipulation;
  }

  ${mixin.placeholderColor(color.textLight)}
`;
