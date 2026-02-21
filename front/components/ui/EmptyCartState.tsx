'use client';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface EmptyCartStateProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyCartState({
  title,
  description,
  ctaLabel,
  ctaHref = '/',
}: EmptyCartStateProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const resolvedTitle = title ?? t('cart.emptyTitle');
  const resolvedDescription = description ?? t('cart.emptyDescription');
  const resolvedCtaLabel = ctaLabel ?? t('cart.emptyCta');

  return (
    <Box maxWidth="sm" mx="auto" mt={8} px={2} textAlign="center">
      <Stack spacing={3} alignItems="center">
        <ShoppingCartOutlinedIcon sx={{ fontSize: 64, color: 'text.secondary' }} />

        <Typography variant="h5" fontWeight={600}>
          {resolvedTitle}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {resolvedDescription}
        </Typography>

        <Button variant="contained" size="large" onClick={() => router.push(ctaHref)}>
          {resolvedCtaLabel}
        </Button>
      </Stack>
    </Box>
  );
}
