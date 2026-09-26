import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Refined Sapphire Blue
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981', // Refined Emerald Green
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0e17', // Rich Obsidian Deep Background
      paper: '#121927',   // Tactile Slate Dark Surface
    },
    text: {
      primary: '#f8fafc', // Slate 50
      secondary: '#94a3b8', // Slate 400
    },
    success: {
      main: '#10b981',
      light: '#34d399',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 },
    h2: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.25 },
    h3: { fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.015em' },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.875rem', fontWeight: 600 },
    subtitle1: { fontSize: '0.925rem', color: '#94a3b8' },
    subtitle2: { fontSize: '0.825rem', color: '#94a3b8', fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        },
        containedSecondary: {
          background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: 'rgba(255, 255, 255, 0.07)',
          backgroundColor: '#121927',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.07)',
          backgroundColor: 'rgba(18, 25, 39, 0.85)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

