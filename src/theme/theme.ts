import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colors, fonts } from './tokens';

export function buildTheme(mode: 'light' | 'dark') {
  const palette = mode === 'dark' ? colors.dark : colors.light;

  const options: ThemeOptions = {
    palette: {
      mode,
      primary: { main: colors.amber, contrastText: '#0B0E14' },
      secondary: { main: colors.cyan, contrastText: '#0B0E14' },
      error: { main: colors.danger },
      success: { main: colors.success },
      background: { default: palette.bg, paper: palette.surface },
      text: { primary: palette.textPrimary, secondary: palette.textSecondary },
      divider: palette.border,
    },
    typography: {
      fontFamily: fonts.body,
      h1: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: '-0.01em' },
      h4: { fontFamily: fonts.display, fontWeight: 600 },
      h5: { fontFamily: fonts.display, fontWeight: 600 },
      h6: { fontFamily: fonts.display, fontWeight: 600 },
      button: { fontFamily: fonts.display, fontWeight: 600, textTransform: 'none' },
      overline: { fontFamily: fonts.mono, letterSpacing: '0.12em' },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, paddingInline: 20, paddingBlock: 10 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontFamily: fonts.mono, fontSize: '0.75rem' },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          '::selection': { backgroundColor: colors.cyan, color: '#0B0E14' },
          scrollbarColor: `${colors.amberDim} transparent`,
        },
      },
    },
  };

  return createTheme(options);
}
