'use client';

import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Printer as Print, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '@/helpers/constants';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'paid' | 'error'>('loading');

  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('order_code');
  const { t } = useTranslation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (!orderCode) {
      router.replace('/home');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `${API_URL}/order/status?order_code=${orderCode}`
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        if (data.status_code === 'paid') {
          setOrderDetails(data.order);
          setStatus('paid');
        } else {
          // čekamo webhook
          setTimeout(checkStatus, 2000);
        }
      } catch {
        setStatus('error');
      }
    };

    checkStatus();
  }, [orderCode, router]);

  // 🔄 LOADING STATE (čekamo webhook)
  if (status === 'loading') {
    return (
      <Box width="100%" height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <CircularProgress />
          <Typography mt={2}>
            Obrada uplate...
          </Typography>
        </Box>
      </Box>
    );
  }

  // ❌ ERROR STATE
  if (status === 'error') {
    return (
      <Box width="100%" height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Typography color="error">
          Greška pri proveri statusa uplate.
        </Typography>
      </Box>
    );
  }

  // ✅ SUCCESS STATE (tek kad backend kaže paid)
  return (
    <Box width={'100%'} minHeight={'100vh'} bgcolor="background.default">
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 2, color: 'success.main', display: 'flex', justifyContent: 'center' }}>
            <CheckCircle size={80} />
          </Box>

          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {t('success.title')}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('success.description')}
          </Typography>

          {orderDetails && (
            <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('success.detailsTitle')}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>{t('success.orderId')}:</strong> {orderDetails.order_code}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>{t('success.total')}:</strong> {orderDetails.total_price} RSD
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
            >
              {t('success.newOrder')}
            </Button>

            {user ? (
              <Button
                variant="outlined"
                startIcon={<User />}
                onClick={() => router.push('/profile')}
              >
                {t('success.myProfile')}
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<User />}
                onClick={() => router.push('/login')}
              >
                {t('success.login')}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}