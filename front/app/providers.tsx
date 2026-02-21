'use client';

import { AuthProvider } from '@/context/AuthContext';
import { PrintProvider } from '@/context/PrintContext';
import { theme } from '@/theme/theme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import '@/lib/i18n';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
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
