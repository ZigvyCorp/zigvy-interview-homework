import { createTheme } from '@mui/material/styles';

const glassMorphismStyle = {
  backdrop: 'blur(20px)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
};

const glassMorphismStyleDark = {
  backdrop: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    secondary: {
      main: '#f8fafc',
      light: '#ffffff',
      dark: '#e2e8f0',
    },
    background: {
      default: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #f0f9ff 100%)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassMorphismStyle,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '12px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(14, 165, 233, 0.2)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...glassMorphismStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
          boxShadow: '0 8px 32px rgba(14, 165, 233, 0.4)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.05)',
            boxShadow: '0 12px 40px rgba(14, 165, 233, 0.5)',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0ea5e9',
      light: '#38bdf8',
      dark: '#0284c7',
    },
    secondary: {
      main: '#f8fafc',
      light: '#ffffff',
      dark: '#e2e8f0',
    },
    background: {
      default: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassMorphismStyleDark,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '12px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...glassMorphismStyleDark,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
          boxShadow: '0 8px 32px rgba(14, 165, 233, 0.4)',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.05)',
            boxShadow: '0 12px 40px rgba(14, 165, 233, 0.5)',
          },
        },
      },
    },
  },
}); 