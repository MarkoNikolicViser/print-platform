'use client';

import { AuthProvider } from '@/context/AuthContext';
import { PrintProvider } from '@/context/PrintContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { AppThemeProvider } from '@/context/ThemeContext';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { createAppTheme } from '@/theme/theme';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createAppTheme(prefersDarkMode ? 'dark' : 'light');

  return (
    <AuthProvider>
      <PrintProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
            <ToastContainer />
          </ThemeProvider>
        </QueryClientProvider>
      </PrintProvider>
    </AuthProvider>
  );
}