import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Navy blue from design inspiration
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f97316', // Coral/orange accent from design inspiration
      light: '#fb923c',
      dark: '#ea580c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fefefe',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e3a8a',
      secondary: '#64748b',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1e3a8a',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1e3a8a',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1e3a8a',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#1e3a8a',
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.025em',
          border: '2px solid transparent',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
          },
        },
        outlined: {
          border: '2px solid #1e3a8a',
          '&:hover': {
            border: '2px solid #1e40af',
            backgroundColor: 'rgba(30, 58, 138, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #1e3a8a',
          borderRadius: 12,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            border: '2px solid #1e3a8a',
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1e40af',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#f97316',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '2px solid #1e3a8a',
          borderRadius: 12,
        },
      },
    },
  },
});
