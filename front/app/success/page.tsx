'use client';

import { Container, Paper, Typography, Box, Button, Alert } from '@mui/material';
import { CheckCircle, Printer as Print, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { t } = useTranslation();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Mock order details based on orderId
    if (orderId) {
      setOrderDetails({
        id: orderId,
        shopName: 'Copy Shop Centar',
        shopAddress: 'Knez Mihailova 15, Beograd',
        estimatedTime: '30-45 minuta',
        contactPhone: '+381 11 123 4567',
      });
    }
  }, [orderId]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 2, color: 'success.main', display: 'flex', justifyContent: 'center' }}>
          <CheckCircle size={80} />
        </Box>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: '#1e3a8a', fontWeight: 600 }}
        >
          {t('success.title')}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {t('success.description')}
        </Typography>

        {orderDetails && (
          <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e3a8a' }}>
              {t('success.detailsTitle')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>{t('success.orderId')}:</strong> {orderDetails.id}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>{t('success.shop')}:</strong> {orderDetails.shopName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>{t('success.address')}:</strong> {orderDetails.shopAddress}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>{t('success.estimatedTime')}:</strong> {orderDetails.estimatedTime}
            </Typography>
            <Typography variant="body2">
              <strong>{t('success.contact')}:</strong> {orderDetails.contactPhone}
            </Typography>
          </Box>
        )}

        <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="body2">
            <strong>{t('success.nextStepsTitle')}:</strong>
          </Typography>
          <Typography variant="body2" component="div" sx={{ mt: 1 }}>
            1. {t('success.nextStepsWaitEmail')}
            <br />
            2. {t('success.nextStepsPrinting')}
            <br />
            3. {t('success.nextStepsNotification')}
            <br />
            4. {t('success.nextStepsPickup')}
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={() => router.push('/home')}
            sx={{ bgcolor: '#f97316', '&:hover': { bgcolor: '#ea580c' } }}
          >
            {t('success.newOrder')}
          </Button>

          {user && (
            <Button
              variant="outlined"
              startIcon={<User />}
              onClick={() => router.push('/profile')}
              sx={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}
            >
              {t('success.myProfile')}
            </Button>
          )}

          {!user && (
            <Button
              variant="outlined"
              startIcon={<User />}
              onClick={() => router.push('/login')}
              sx={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}
            >
              {t('success.login')}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
