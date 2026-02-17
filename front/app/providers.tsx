'use client';

import { AuthProvider } from '@/context/AuthContext';
import { PrintProvider } from '@/context/PrintContext';
import { theme } from '@/theme/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ToastContainer } from 'react-toastify';

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
