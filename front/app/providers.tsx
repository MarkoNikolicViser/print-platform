'use client';

import { AuthProvider } from '@/context/AuthContext';
import { PrintProvider } from '@/context/PrintContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { AppThemeProvider } from '@/context/ThemeContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PrintProvider>
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            {children}
            <ToastContainer />
          </AppThemeProvider>
        </QueryClientProvider>
      </PrintProvider>
    </AuthProvider>
  );
}