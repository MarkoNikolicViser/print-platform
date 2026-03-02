'use client';

import { Header } from '@/components/header';
import { useMarkOrderPaid } from '@/hooks/useMarkOrderPaid';
import { useOrderItems } from '@/hooks/useOrderItems';
import { Box, Typography, Paper, Stack, Container, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [notifEmail, setNotifEmail] = useState<string>('');

  const { mutate: payment } = useMarkOrderPaid();
  const { data, isLoading, isError } = useOrderItems(orderCode ?? undefined);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const code = localStorage.getItem('order_code');
    if (!code) {
      router.push('/home');
      return;
    }
    setOrderCode(code);
    if (!user?.email) {
      const localStorageEmail = localStorage.getItem('customer_email');
      setNotifEmail(localStorageEmail || '');
      return;
    }
    setNotifEmail(user?.email || '');
  }, [mounted, router]);

  const currencyFmt = useMemo(
    () =>
      new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
      }),
    [],
  );

  if (!mounted) return null;

  if (isLoading || !data) {
    return (
      <Box minHeight="100vh">
        <Header />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Typography align="center">{t('checkout.loading')}</Typography>
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

  const totalQuantity = data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0);

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

  const EUR_RATE = 117.2;
  const amountInEur = (Number(data.total) / EUR_RATE).toFixed(2);

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Header />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" color="text.primary" fontWeight={600} gutterBottom>
          {t('checkout.title')}
        </Typography>

        {/* ORDER SUMMARY */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t('checkout.service')}</Typography>
              <Stack alignItems="flex-end">
                {hasMultipleServices ? (
                  services.map((s: any, idx: number) => (
                    <Typography key={idx} variant="caption">
                      • {s.name} × {s.quantity}
                    </Typography>
                  ))
                ) : (
                  <Typography fontWeight={500}>{services[0]?.name}</Typography>
                )}
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t('checkout.totalQuantity')}</Typography>
              <Typography fontWeight={500}>{totalQuantity}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>{t('checkout.totalToPay')}</Typography>
              <Typography variant="h6">{currencyFmt.format(Number(data.total))}</Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* PAYMENT */}
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {t('checkout.cardPayment')}
          </Typography>

          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
              currency: 'EUR',
              intent: 'capture',
              components: 'buttons',
            }}
          >
            <PayPalButtons
              fundingSource="card"
              style={{ layout: 'vertical' }}
              createOrder={(_, actions) =>
                actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'EUR',
                        value: amountInEur,
                      },
                    },
                  ],
                  payer: {
                    email_address: notifEmail,
                    phone: {
                      phone_type: 'MOBILE',
                      phone_number: {
                        national_number: '381601234567',
                        country_code: '381',
                      },
                    },
                    name: {
                      given_name: 'Petar',
                      surname: 'Petrovic',
                    },
                    tax_info: {
                      tax_id: '123456789',
                      tax_id_type: 'BR_CNPJ',
                    },
                    address: {
                      address_line_1: 'Beogradska 12',
                      address_line_2: 'Stan 5',
                      admin_area_2: 'Beograd',
                      admin_area_1: 'Central Serbia',
                      postal_code: '11000',
                      country_code: 'RS',
                    },
                  },
                  application_context: {
                    shipping_preference: 'NO_SHIPPING',
                  },
                })
              }
              onApprove={async (_, actions) => {
                const details = await actions.order?.capture();
                const captureId = details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
                if (!captureId) return;

                payment({
                  order_code: orderCode,
                  customer_email: details?.payer?.email_address,
                  provider: 'PayPal',
                  provider_payment_id: captureId,
                  amount: Number(data.total),
                  fee: 0,
                });

                router.push('/home/success');
              }}
              onError={(err) => {
                console.error('PayPal error:', err);
              }}
            />
          </PayPalScriptProvider>
        </Paper>
      </Container>
    </Box>
  );
}
