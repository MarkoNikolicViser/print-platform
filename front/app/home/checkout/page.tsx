'use client';

import { Header } from '@/components/header';
import { API_URL } from '@/helpers/constants';
import { useOrderItems } from '@/hooks/useOrderItems';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Container,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useColorScheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '@/context/AuthContext';

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function StripeCardForm({ orderCode }: { orderCode: string }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode : mode;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const card = elements?.getElement(CardElement);

    if (card) {
      const isDark = resolvedMode === 'dark';

      card.update({
        style: {
          base: {
            fontSize: '16px',
            color: isDark ? '#fff' : '#000',
            iconColor: isDark ? '#fff' : '#000',
            '::placeholder': {
              color: isDark ? '#aaa' : '#666',
            },
          },
          invalid: {
            color: theme.palette.error.main,
          },
        },
      });
    }
  }, [resolvedMode, elements]);
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const res = await fetch(
        `${API_URL}/stripe/create-payment-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_code: orderCode }),
        }
      );

      const data = await res.json();
      setClientSecret(data.clientSecret);
    };

    fetchPaymentIntent();
  }, [orderCode]);

  const handleSubmit = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setErrorMsg(null);

    const { error, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

    if (error) {
      setErrorMsg(error.message || 'Payment failed');
      setLoading(false);
      return;
    }

    // ⚠️ NE verujemo frontendu
    if (paymentIntent) {
      router.push(`/success?order_code=${orderCode}`);
    }
  };

  return (
    <>
      <CardElement
        options={{
          hidePostalCode: true,
          style: {
            base: {
              fontSize: '16px',
              color: theme.palette.text.primary,
              iconColor: theme.palette.text.primary,
              '::placeholder': {
                color: theme.palette.text.secondary,
              },
            },
            invalid: {
              color: theme.palette.error.main,
            },
          },
        }}
      />

      {errorMsg && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={!stripe || loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Plati karticom'}
      </Button>
    </>
  );
}

export default function CheckoutPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [orderCode, setOrderCode] = useState<string | null>(null);

  const { data, isLoading, isError } = useOrderItems(orderCode ?? undefined);

  const currencyFmt = useMemo(
    () =>
      new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
      }),
    [],
  );

  useEffect(() => {
    const code = localStorage.getItem('order_code');
    if (!code) {
      router.replace('/home');
      return;
    }
    setOrderCode(code);
  }, [router]);

  if (!orderCode || isLoading) {
    return (
      <Box minHeight="100vh">
        <Header />
        <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box minHeight="100vh">
        <Header />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Typography align="center" color="error">
            {t('checkout.loadError')}
          </Typography>
        </Container>
      </Box>
    );
  }

  const totalQuantity =
    data.items?.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0,
    ) ?? 0;

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Header />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" color='text.primary' fontWeight={600} gutterBottom>
          {t('checkout.title')}
        </Typography>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">
                {t('checkout.totalQuantity')}
              </Typography>
              <Typography fontWeight={500}>{totalQuantity}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>
                {t('checkout.totalToPay')}
              </Typography>
              <Typography variant="h6">
                {currencyFmt.format(Number(data.total ?? 0))}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {t('checkout.cardPayment')}
          </Typography>

          <Elements stripe={stripePromise}>
            <StripeCardForm orderCode={orderCode} />
          </Elements>
        </Paper>
      </Container>
    </Box>
  );
}