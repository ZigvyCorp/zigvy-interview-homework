import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import { useAppSelector } from './store/hooks';
import { lightTheme, darkTheme } from './theme';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const globalStyles = (theme: any) => ({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  'body, html, #root': {
    height: '100%',
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    background: theme.palette.background.default,
    backgroundAttachment: 'fixed',
    margin: 0,
    padding: 0,
  },
  '#root': {
    minHeight: '100vh',
  },
  // Custom scrollbar
  '::-webkit-scrollbar': {
    width: '8px',
  },
  '::-webkit-scrollbar-track': {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
  },
  '::-webkit-scrollbar-thumb': {
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(255,255,255,0.5)',
    },
  },
});

const ThemedApp: React.FC = () => {
  const themeState = useAppSelector(state => state.theme);
  const mode = themeState?.mode || 'light';
  const currentTheme = mode === 'light' ? lightTheme : darkTheme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles(currentTheme)} />
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ 
          '& .SnackbarContent-root': {
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        <Router>
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
};

export default App;
