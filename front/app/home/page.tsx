'use client';

import { Box, Container, Stack, Typography } from '@mui/material';

import { FileUploadSection } from '@/components/file-upload-section';
import { Header } from '@/components/header';
import { PrintConfigSection } from '@/components/print-config-section';
import { ShopSelectionSection } from '@/components/shop-selection-section';
import { PrintProvider } from '@/context/PrintContext';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              color="primary.main"
              sx={{ mb: 1 }}
            >
              Štampanje bez čekanja u redu
            </Typography>
            <Typography color="text.secondary">
              Otpremite fajlove, platite online i pokupite gotove kopije
            </Typography>
          </Box>
          <PrintProvider>
            <FileUploadSection />
            <PrintConfigSection />
            <ShopSelectionSection />
          </PrintProvider>
        </Stack>
      </Container>
    </Box>
  );
}
