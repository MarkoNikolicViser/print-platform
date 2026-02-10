'use client';

import { Header } from '@/components/header';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Stack, Button, Container, Divider } from '@mui/material';

import { useOrderItems } from '@/hooks/useOrderItems';
import { useMarkOrderPaid } from '@/hooks/useMarkOrderPaid';

export default function CheckoutPage() {
  const router = useRouter();
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const { mutate: payment } = useMarkOrderPaid();

  const handlePayment = () => {
    const payload = {
      order_code: 'aca5063a-1af0-451a-83e1-cc23f9f6c2ed',
      customer_email: 'kupac@test.com',
      provider: 'PayPal',
      provider_payment_id: 'PAYID-MOCK-9ABCD12345',
      amount: 1499.0,
      fee: 59.0,
    };
    payment(payload);
  };

  useEffect(() => {
    const code = localStorage.getItem('order_code');
    if (!code) {
      router.push('/home');
      return;
    }
    setOrderCode(code);
  }, [router]);

  const { data, isLoading, isError } = useOrderItems(orderCode ?? undefined);

  const currencyFmt = useMemo(
    () =>
      new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
      }),
    [],
  );

  if (isLoading || !orderCode) {
    return (
      <Box minHeight="100vh" bgcolor="background.default">
        <Header />
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Typography align="center">Učitava se checkout…</Typography>
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
            Greška pri učitavanju narudžbine.
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
  const totalQuantity = data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  // Grupisanje po usluzi (product_template)
  const servicesMap = data.items.reduce((acc: Record<string, any>, item: any) => {
    const key = item.product_template?.id ?? 'unknown';

    if (!acc[key]) {
      acc[key] = {
        name:
          item.product_template?.description ?? item.product_template?.name ?? 'Nepoznata usluga',
        quantity: 0,
      };
    }

    acc[key].quantity += item.quantity;
    return acc;
  }, {});

  const services = Object.values(servicesMap);
  const hasMultipleServices = services.length > 1;

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Header />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Plaćanje
        </Typography>

        {/* ORDER SUMMARY */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            {/* USLUGA / USLUGE */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography color="text.secondary">Usluga</Typography>

              <Stack alignItems="flex-end" spacing={0.5}>
                {hasMultipleServices ? (
                  <>
                    <Typography fontWeight={500}>Više usluga ({services.length})</Typography>

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
              <Typography color="text.secondary">Ukupna količina</Typography>
              <Typography fontWeight={500}>{totalQuantity}</Typography>
            </Stack>

            <Divider />

            {/* TOTAL */}
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>Ukupno za plaćanje</Typography>
              <Typography variant="h6">{currencyFmt.format(Number(data.total))}</Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* PAYPAL */}
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Plaćanje karticom
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sigurno plaćanje putem PayPal sistema. PayPal nalog nije potreban.
          </Typography>

          {/* ovde ide PayPalButtons */}
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              p: 2,
              borderRadius: 1,
              textAlign: 'center',
              mb: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              PayPal Card Payment UI
            </Typography>
          </Box>

          <Button fullWidth size="large" variant="contained" onClick={handlePayment}>
            Plati {currencyFmt.format(Number(data.total))}
          </Button>
        </Paper>

        <Stack direction="row" justifyContent="flex-end" mt={2}>
          <Button variant="text" onClick={() => router.push('/home/cart')}>
            Nazad na korpu
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
