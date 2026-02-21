'use client';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function NoOrdersEmptyState() {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 6,
        p: 2,
        textAlign: 'center',
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Stack spacing={3} alignItems="center">
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main' }} />

          <Typography variant="h5" fontWeight={600}>
            {t('admin.noOrders.title')}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t('admin.noOrders.description')}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
