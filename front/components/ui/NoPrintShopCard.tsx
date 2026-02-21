'use client';

import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface Props {
  createUrl?: string; // gde vodi dugme (default: /dashboard/print-shop/create)
}
interface Props {
  createUrl?: string;
  onCreate?: () => void;
}

export default function NoPrintShopCard({
  createUrl = '/dashboard/print-shop/create',
  onCreate,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleClick = () => {
    if (onCreate) {
      onCreate();
    } else {
      router.push(createUrl);
    }
  };

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
          <StorefrontIcon sx={{ fontSize: 60, color: 'primary.main' }} />

          <Typography variant="h5" fontWeight={600}>
            {t('admin.noPrintShop.title')}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t('admin.noPrintShop.description')}
          </Typography>

          <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={handleClick}>
            {t('admin.noPrintShop.createButton')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
