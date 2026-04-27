// src/theme/index.js

export const Colors = {
  // Primary Blue
  blue50: '#E6F1FB',
  blue100: '#B5D4F4',
  blue200: '#85B7EB',
  blue300: '#5599E2',
  blue400: '#378ADD',
  blue500: '#2272C9',
  blue600: '#185FA5',
  blue700: '#124D87',
  blue800: '#0C447C',
  blue900: '#042C53',

  // Teal (success / processed)
  teal50: '#E1F5EE',
  teal100: '#9FE1CB',
  teal200: '#5DCAA5',
  teal400: '#1D9E75',
  teal600: '#0F6E56',
  teal800: '#085041',

  // Amber (warning / pending)
  amber50: '#FAEEDA',
  amber100: '#FAC775',
  amber200: '#EF9F27',
  amber400: '#BA7517',
  amber600: '#854F0B',
  amber800: '#633806',

  // Red (danger / urgent / error)
  red50: '#FCEBEB',
  red100: '#F7C1C1',
  red200: '#F09595',
  red400: '#E24B4A',
  red600: '#A32D2D',
  red800: '#791F1F',

  // Green (active / ok)
  green50: '#EAF3DE',
  green200: '#97C459',
  green400: '#639922',
  green600: '#3B6D11',

  // Purple (admin role)
  purple50: '#EEEDFE',
  purple100: '#CECBF6',
  purple200: '#AFA9EC',
  purple400: '#7F77DD',
  purple600: '#534AB7',
  purple800: '#3C3489',

  // Coral (attachments)
  coral50: '#FAECE7',
  coral200: '#F0997B',
  coral400: '#D85A30',
  coral600: '#993C1D',

  // Gray scale
  gray50: '#F8F9FC',
  gray100: '#F0F2F8',
  gray150: '#E8EAED',
  gray200: '#D3D1C7',
  gray300: '#B4B2A9',
  gray400: '#888780',
  gray500: '#6E6D68',
  gray600: '#5F5E5A',
  gray700: '#4A4946',
  gray800: '#444441',
  gray900: '#2C2C2A',

  // Semantic shortcuts
  background: '#F0F2F8',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E8EAED',
  borderLight: '#F0F2F8',
  textPrimary: '#2C2C2A',
  textSecondary: '#5F5E5A',
  textMuted: '#888780',
  textDisabled: '#B4B2A9',
};

export const Typography = {
  displayLg: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: Colors.blue900 },
  displayMd: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3, color: Colors.blue900 },
  h1: { fontSize: 22, fontWeight: '700', letterSpacing: -0.2, color: Colors.blue900 },
  h2: { fontSize: 18, fontWeight: '700', color: Colors.blue900 },
  h3: { fontSize: 16, fontWeight: '600', color: Colors.blue900 },
  h4: { fontSize: 14, fontWeight: '600', color: Colors.gray900 },
  bodyLg: { fontSize: 15, fontWeight: '400', lineHeight: 22, color: Colors.gray800 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20, color: Colors.gray800 },
  bodySm: { fontSize: 13, fontWeight: '400', lineHeight: 18, color: Colors.gray700 },
  caption: { fontSize: 12, fontWeight: '400', color: Colors.gray500 },
  captionSm: { fontSize: 11, fontWeight: '400', color: Colors.gray400 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.gray500 },
  mono: { fontSize: 11, fontFamily: 'monospace', color: Colors.blue600, letterSpacing: 0.2 },
  monoSm: { fontSize: 10, fontFamily: 'monospace', color: Colors.blue600 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 28,
};

export const Radius = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 999,
};

export const Shadow = {
  xs: {
    shadowColor: '#042C53',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#042C53',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#042C53',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#042C53',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const RoleColors = {
  Admin:   { bg: Colors.purple50,  border: Colors.purple100, text: Colors.purple800 },
  Agent:   { bg: Colors.blue50,    border: Colors.blue100,   text: Colors.blue800   },
  Lecteur: { bg: Colors.teal50,    border: Colors.teal100,   text: Colors.teal800   },
};

export const StatusColors = {
  Pending:   { bg: Colors.amber50,  border: Colors.amber100,  text: Colors.amber600  },
  'In Progress': { bg: Colors.blue50, border: Colors.blue100, text: Colors.blue600   },
  Processed: { bg: Colors.teal50,   border: Colors.teal100,   text: Colors.teal600   },
  Urgent:    { bg: Colors.red50,    border: Colors.red100,    text: Colors.red600    },
  Archived:  { bg: Colors.gray100,  border: Colors.gray200,   text: Colors.gray600   },
  Sent:      { bg: Colors.teal50,   border: Colors.teal100,   text: Colors.teal600   },
  Draft:     { bg: Colors.blue50,   border: Colors.blue100,   text: Colors.blue500   },
  Active:    { bg: Colors.green50,  border: Colors.green200,  text: Colors.green600  },
  Disabled:  { bg: Colors.red50,    border: Colors.red100,    text: Colors.red600    },
};
