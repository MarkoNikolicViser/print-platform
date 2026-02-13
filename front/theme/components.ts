import { Components, alpha, Theme } from '@mui/material/styles';
import { grey } from './colors';

export const components: Components<Theme> = {
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'light' ? 'rgba(255,255,255,0.85)' : alpha('#0F172A', 0.8),
        backdropFilter: 'blur(8px)',
        borderBottom:
          theme.palette.mode === 'light'
            ? '1px solid #E5E7EB'
            : '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'none',
      }),
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: 10,
      },
      containedPrimary: {
        boxShadow: '0 10px 30px rgba(37,99,235,0.20)',
        '&:hover': { boxShadow: '0 12px 36px rgba(37,99,235,0.28)' },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 10px 30px rgba(2,6,23,0.06)',
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        color:
          theme.palette.mode === 'light'
            ? grey[600] // #475569
            : grey[300], // #CBD5E1
        textUnderlineOffset: 2,
        '&:hover': {
          color:
            theme.palette.mode === 'light'
              ? theme.palette.text.primary // #020617
              : '#FFFFFF',
        },
      }),
    },
  },
  MuiContainer: {
    defaultProps: { maxWidth: 'lg' },
  },
};
