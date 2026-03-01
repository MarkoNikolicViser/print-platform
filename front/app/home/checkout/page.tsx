'use client';

import { Header } from '@/components/header';
import { useMarkOrderPaid } from '@/hooks/useMarkOrderPaid';
import { useOrderItems } from '@/hooks/useOrderItems';
import { Box, Typography, Paper, Stack, Button, Container, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const { mutate: payment } = useMarkOrderPaid();

  const handlePayment = () => {
    const orderCode = localStorage.getItem('order_code');
    if (!orderCode) {
      return;
    }
    const payload = {
      order_code: orderCode,
      customer_email: 'kupac@test.com',
      provider: 'PayPal' as const,
      provider_payment_id: 'PAYID-MOCK-9ABCD12345',
      amount: 1499.0,
      fee: 59.0,
    };
    payment(payload);
  };

  const { data, isLoading, isError } = useOrderItems(orderCode ?? undefined);

  const currencyFmt = useMemo(
    () =>
      new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
      }),
    [],
  );

  if (isLoading) {
    return (
      <Box minHeight="100vh" bgcolor="background.default">
        <Header />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Typography align="center">{t('checkout.loading')}</Typography>
        </Container>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box minHeight="100vh" bgcolor="background.default">
        <Header />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Typography align="center" color="error">
            {t('checkout.loadError')}
          </Typography>
        </Container>
      </Box>
    );
  }

  /** -------------------------
   *  AGREGACIJE
   *  -------------------------
   */

  // Ukupna količina (svi item-i)
  const totalQuantity = data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0);

  // Grupisanje po usluzi (product_template)
  const servicesMap = data.items?.reduce((acc: Record<string, any>, item: any) => {
    const key = item.product_template?.id ?? 'unknown';

    if (!acc[key]) {
      acc[key] = {
        name:
          item.product_template?.description ??
          item.product_template?.name ??
          t('checkout.unknownService'),
        quantity: 0,
      };
    }

    acc[key].quantity += item.quantity;
    return acc;
  }, {});

  const services = Object.values(servicesMap || {});
  const hasMultipleServices = services.length > 1;
  const EUR_RATE = 117.2 // ili dinamički kurs
  const amountInEur = (Number(data.total) / EUR_RATE).toFixed(2);

  useEffect(() => {
    const code = localStorage.getItem('order_code');
    if (!code || !services) {
      router.push('/home');
      return;
    }
    setOrderCode(code);
  }, [router]);

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Header />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {t('checkout.title')}
        </Typography>

        {/* ORDER SUMMARY */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            {/* USLUGA / USLUGE */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography color="text.secondary">{t('checkout.service')}</Typography>

              <Stack alignItems="flex-end" spacing={0.5}>
                {hasMultipleServices ? (
                  <>
                    <Typography fontWeight={500}>
                      {t('checkout.multipleServices', { count: services.length })}
                    </Typography>

                    {services.map((s: any, idx: number) => (
                      <Typography key={idx} variant="caption" color="text.secondary">
                        • {s.name} × {s.quantity}
                      </Typography>
                    ))}
                  </>
                ) : (
                  <Typography fontWeight={500}>{services[0]?.name}</Typography>
                )}
              </Stack>
            </Stack>

            {/* KOLIČINA */}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t('checkout.totalQuantity')}</Typography>
              <Typography fontWeight={500}>{totalQuantity}</Typography>
            </Stack>

            <Divider />

            {/* TOTAL */}
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>{t('checkout.totalToPay')}</Typography>
              <Typography variant="h6">{currencyFmt.format(Number(data.total))}</Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* PAYPAL */}
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {t('checkout.cardPayment')}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('checkout.cardPaymentDescription')}
          </Typography>

          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
              currency: 'EUR',
              intent: 'capture',
            }}
          >
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={async (_, actions) => {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'EUR',
                        value: amountInEur,
                      },
                      description: `Order ${orderCode}`,
                    },
                  ],
                });
              }}
              onApprove={async (dataApprove, actions) => {
                if (!actions.order) return;

                const details = await actions.order.capture();

                const captureId =
                  details.purchase_units?.[0]?.payments?.captures?.[0]?.id;

                if (!captureId) {
                  console.error('No capture ID');
                  return;
                }

                const payload = {
                  order_code: orderCode,
                  customer_email: details.payer?.email_address,
                  provider: 'PayPal' as const,
                  provider_payment_id: captureId,
                  amount: Number(data.total),
                  fee: 0, // real fee možeš kasnije računati preko webhook-a
                };

                payment(payload);

                router.push('/home/success');
              }}
              onError={(err) => {
                console.error('PayPal error:', err);
              }}
            />
          </PayPalScriptProvider>
        </Paper>

        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Button variant="text" onClick={() => router.push('/home/cart')}>
            {t('checkout.backToCart')}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
