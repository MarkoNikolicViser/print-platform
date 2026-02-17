'use client';

import React from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export function NoOrdersEmptyState() {
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
            Još nema porudžbina
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Kada kupci pošalju porudžbinu, pojaviće se ovde.
          </Typography>

        </Stack>
      </CardContent>
    </Card>
  );
}
