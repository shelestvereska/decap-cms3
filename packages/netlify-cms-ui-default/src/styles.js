import { css, injectGlobal } from 'react-emotion';

export { fonts, colorsRaw, colors, lengths, components, buttons, shadows, borders, transitions };

/**
 * Font Stacks
 */
const fonts = {
  primary: `
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol"
  `,
  mono: `
    'SFMono-Regular',
    Consolas,
    "Liberation Mono",
    Menlo,
    Courier,
    monospace;
  `,
};

/**
 * Theme Colors
 */
const colorsRaw = {
  white: '#fff',
  grayLight: '#eff0f4',
  gray: '#798291',
  grayDark: '#313d3e',
  blue: '#3a69c7',
  blueLight: '#e8f5fe',
  green: '#005614',
  greenLight: '#caef6f',
  brown: '#754e00',
  yellow: '#ffee9c',
  red: '#ff003b',
  redLight: '#fcefea',
  purple: '#70399f',
  purpleLight: '#f6d8ff',
  teal: '#17a2b8',
  tealLight: '#ddf5f9',
};

const colors = {
  statusDraftText: colorsRaw.purple,
  statusDraftBackground: colorsRaw.purpleLight,
  statusReviewText: colorsRaw.Brown,
  statusReviewBackground: colorsRaw.yellow,
  statusReadyText: colorsRaw.green,
  statusReadyBackground: colorsRaw.greenLight,
  text: colorsRaw.gray,
  textLight: colorsRaw.white,
  textLead: colorsRaw.grayDark,
  background: colorsRaw.grayLight,
  foreground: colorsRaw.white,
  active: colorsRaw.blue,
  activeBackground: colorsRaw.blueLight,
  inactive: colorsRaw.gray,
  button: colorsRaw.gray,
  buttonText: colorsRaw.white,
  inputBackground: colorsRaw.white,
  infoText: colorsRaw.blue,
  infoBackground: colorsRaw.blueLight,
  successText: colorsRaw.green,
  successBackground: colorsRaw.greenLight,
  warnText: colorsRaw.brown,
  warnBackground: colorsRaw.yellow,
  errorText: colorsRaw.red,
  errorBackground: colorsRaw.redLight,
  textFieldBorder: '#dfdfe3',
  controlLabel: '#7a8291',
};

const lengths = {
  topBarHeight: '56px',
  inputPadding: '16px 20px',
  borderRadius: '5px',
  richTextEditorMinHeight: '300px',
  borderWidth: '2px',
  topCardWidth: '682px',
  pageMargin: '84px 18px',
};

const borders = {
  textField: `solid  ${lengths.borderWidth} ${colors.textFieldBorder}`,
};

const transitions = {
  main: '.2s ease',
};

const shadows = {
  drop: css`
    box-shadow: 0 2px 4px 0 rgba(19, 39, 48, 0.12);
  `,
  dropMain: css`
    box-shadow: 0 2px 6px 0 rgba(68, 74, 87, 0.05), 0 1px 3px 0 rgba(68, 74, 87, 0.1);
  `,
  dropMiddle: css`
    box-shadow: 0 2px 6px 0 rgba(68, 74, 87, 0.15), 0 1px 3px 0 rgba(68, 74, 87, 0.3);
  `,
  dropDeep: css`
    box-shadow: 0 4px 12px 0 rgba(68, 74, 87, 0.15), 0 1px 3px 0 rgba(68, 74, 87, 0.25);
  `,
};

const textBadge = css`
  font-size: 13px;
  border-radius: ${lengths.borderRadius};
  padding: 4px 10px;
  text-align: center;
  display: inline-block;
  line-height: 1;
`;

const card = css`
  ${shadows.dropMain};
  border-radius: 5px;
  background-color: #fff;
`;

const buttons = {
  button: css`
    border: 0;
    border-radius: ${lengths.borderRadius};
    cursor: pointer;
    background-color: ${colorsRaw.blueLight};
  `,
  default: css`
    height: 36px;
    line-height: 36px;
    font-weight: 500;
    padding: 0 15px;
    background-color: ${colorsRaw.gray};
    color: ${colorsRaw.white};
  `,
  medium: css`
    height: 27px;
    line-height: 27px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 3px;
    padding: 0 24px 0 14px;
  `,
  small: css`
    height: 23px;
    line-height: 23px;
  `,
  gray: css`
    background-color: ${colors.button};
    color: ${colors.buttonText};

    &:focus,
    &:hover {
      color: ${colors.white};
      background-color: #555a65;
    }
  `,
  green: css`
    background-color: #aae31f;
    color: ${colorsRaw.green};
  `,
  lightRed: css`
    background-color: ${colorsRaw.redLight};
    color: ${colorsRaw.red};
  `,
  lightBlue: css`
    background-color: ${colorsRaw.blueLight};
    color: ${colorsRaw.blue};
  `,
  lightTeal: css`
    background-color: ${colorsRaw.tealLight};
    color: #1195aa;
  `,
  teal: css`
    background-color: ${colorsRaw.teal};
    color: ${colorsRaw.white};
  `,
  disabled: css`
    background-color: ${colorsRaw.grayLight};
    color: ${colorsRaw.gray};
  `,
};

const components = {
  card,
  caretDown: css`
    color: ${colorsRaw.white};
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid currentColor;
    border-radius: 2px;
  `,
  textBadge: css`
    ${textBadge};
    color: ${colors.infoText};
  `,
  textBadgeSuccess: css`
    ${textBadge};
    color: ${colors.successText};
    font-weight: bold;
  `,
  textBadgeDanger: css`
    ${textBadge};
    color: ${colorsRaw.red};
    font-weight: bold;
  `,
  loaderSize: css`
    width: 2.28571429rem;
    height: 2.28571429rem;
  `,
  cardTop: css`
    ${card};
    width: ${lengths.topCardWidth};
    max-width: 100%;
    padding: 18px 20px;
    margin-bottom: 28px;
  `,
  cardTopHeading: css`
    font-size: 22px;
    font-weight: 600;
    line-height: 37px;
    margin: 0;
    padding: 0;
  `,
  cardTopDescription: css`
    max-width: 480px;
    color: ${colors.text};
    font-size: 14px;
    margin-top: 8px;
  `,
  objectWidgetTopBarContainer: css`
    padding: 0 14px 14px;
  `,
  dropdownList: css`
    ${shadows.dropDeep};
    background-color: ${colorsRaw.white};
    border-radius: ${lengths.borderRadius};
    overflow: hidden;
  `,
  dropdownItem: css`
    ${buttons.button};
    background-color: transparent;
    border-radius: 0;
    color: ${colorsRaw.gray};
    font-weight: 500;
    border-bottom: 1px solid #eaebf1;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-of-type {
      border-bottom: 0;
    }

    &:hover,
    &:active,
    &:focus {
      color: ${colors.active};
      background-color: ${colors.activeBackground};
    }
  `,
};

injectGlobal`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  :focus {
    outline: -webkit-focus-ring-color auto ${lengths.borderRadius};
  }

  /**
   * Don't show outlines if the user is utilizing mouse rather than keyboard.
   */
  [data-whatintent="mouse"] *:focus {
    outline: none;
  }


  input {
    border: 0;
  }

  body {
    font-family: ${fonts.primary};
    font-weight: normal;
    background-color: ${colors.background};
    color: ${colors.text};
    margin: 0;
  }

  ul, ol {
    padding-left: 0;
  }

  h1, h2, h3, h4, h5, h6, p {
    font-family: ${fonts.primary};
    color: ${colors.textLead};
    font-size: 15px;
    line-height: 1.5;
    margin-top: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
  }

  h1 {
    font-size: 24px;
    letter-spacing: 0.4px;
    color: ${colors.textLead};
  }

  a,
  button {
    font-size: 14px;
    font-weight: 500;
  }

  a {
    color: ${colors.text};
    text-decoration: none;
  }

  img {
    max-width: 100%;
  }

  textarea {
    resize: none;
  }
`;
