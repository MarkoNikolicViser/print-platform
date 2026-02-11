'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  Paper,
  Chip,
  TextField,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { OrderItem, SelectedOptions, AllowedOption } from '@/types';
import { renderOptionField } from '../components/ui/DynamicRenderOfFields';
import { useDirtyCart } from '../hooks/useDirtyCart';
import { useOrderItems } from '../hooks/useOrderItems';
import { useSyncCart } from '../hooks/useSyncCart';
import ErrorState from './ui/error-state';
import { OrderItemsSkeleton } from './ui/OrderItemsSkeleton';
import EmptyCartState from './ui/EmptyCartState';

/** Memoized email input component */
const CustomerEmailInput = React.memo(function CustomerEmailInput({
  email,
  setEmail,
  isLoggedIn,
}: {
  email: string;
  setEmail: (val: string) => void;
  isLoggedIn: boolean;
}) {
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    localStorage.setItem('customer_email', val); // instant update
  };

  if (isLoggedIn) {
    return (
      <Typography variant="body2" color="text.secondary">
        Ulogovani ste – obaveštenja stižu na vaš nalog.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="Email za obaveštenja"
        type="email"
        value={email}
        onChange={handleChange}
        error={email.length > 0 && !isEmailValid}
        helperText={
          email.length > 0 && !isEmailValid
            ? 'Unesite ispravan email'
            : 'Na ovaj email stiže potvrda i status narudžbine'
        }
        fullWidth
        required
      />
      <Divider />
      <Button variant="outlined" onClick={() => console.log('Go to login')}>
        Ili se uloguj
      </Button>
    </Stack>
  );
});

export default function CartItemsSection() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [customerNotificationEmail, setCustomerNotificationEmail] = useState(
    () => localStorage.getItem('customer_email') || '',
  );

  const isLoggedIn = false; // TODO: zameni realnom auth logikom
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerNotificationEmail);
  const canProceedToPayment = isLoggedIn || isEmailValid;

  const { mutate: syncCart, isPending: isLoadingSync } = useSyncCart();
  const { data: orderItems, isLoading, isError, error } = useOrderItems(orderId);

  const serverItems = useMemo(
    () => (orderItems?.items as OrderItem[]) ?? [],
    [orderItems],
  );

  const [edited, setEdited] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (serverItems.length > 0) {
      setEdited(structuredClone(serverItems));
    }
  }, [serverItems]);

  const { dirty, patch, changed, reset } = useDirtyCart(serverItems, edited);

  const currencyFmt = useMemo(
    () =>
      new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
        minimumFractionDigits: 2,
      }),
    [],
  );

  const handleOptionChange = <K extends keyof SelectedOptions>(
    itemId: number,
    key: K,
    value: SelectedOptions[K],
  ) => {
    setEdited((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
            ...it,
            selected_options: {
              ...it.selected_options,
              [key]: value,
            },
          }
          : it,
      ),
    );
  };

  const handleQuantityChange = (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    setEdited((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it)),
    );
  };

  const handleRemove = (id: number) => {
    setEdited((prev) => prev.filter((it) => it.id !== id));
  };

  const resetChanges = () => {
    const snapshot = structuredClone(serverItems);
    setEdited(snapshot);
    reset(snapshot);
  };

  const saveChanges = async () => {
    if (!dirty) return;

    syncCart({
      order_code: orderId,
      updated: patch.update,
      deletedIds: patch.remove,
    });

    reset(structuredClone(edited));
  };

  useEffect(() => {
    const stored = localStorage.getItem('order_code');
    if (stored) setOrderId(String(stored));
  }, []);

  if (isLoading || !orderId) return <OrderItemsSkeleton />;
  if (isError) return <ErrorState queryKey={['order-items']} message={error.message} />;
  if (edited.length === 0) return <EmptyCartState />;

  return (
    <Box maxWidth="md" mx="auto" mt={4} px={2}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Stavke narudžbine</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={resetChanges} disabled={!dirty}>
              Poništi izmene
            </Button>
            <Button variant="contained" onClick={saveChanges} disabled={!dirty || isLoadingSync}>
              Sačuvaj izmene
            </Button>
          </Stack>
        </Stack>

        {dirty && changed.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Izmenjeno: {changed.join(', ')}
          </Typography>
        )}

        <Stack spacing={2}>
          {edited.map((item) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.document_name} ({item.document_pages} str.)
                    </Typography>

                    {item.document_url && (
                      <Chip
                        icon={<VisibilityIcon />}
                        label="Preview"
                        size="small"
                        clickable
                        onClick={() =>
                          window.open(item.document_url, '_blank', 'noopener,noreferrer')
                        }
                      />
                    )}
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    • TIP: {item.document_mime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Usluga: {item.product_template.description}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Jedinična cena:{' '}
                    <b>{currencyFmt.format(Number(item.unit_price))}</b>
                  </Typography>
                  <Typography variant="body2">
                    Ukupno za ovu stavku:{' '}
                    <b>{currencyFmt.format(Number(item.total_price))}</b>
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      −
                    </Button>
                    <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                      Količina: {item.quantity}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemove(item.id)}
                      sx={{ ml: 'auto' }}
                    >
                      Ukloni
                    </Button>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                  <Grid container spacing={2}>
                    {Object.entries(item.allowed_options || {}).map(([key, option]) => (
                      <Grid size={{ xs: 12, md: 6, sm: 3 }} key={key}>
                        {renderOptionField(
                          item,
                          key as keyof SelectedOptions,
                          option as AllowedOption,
                          handleOptionChange,
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>

        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={600}>Ukupan iznos</Typography>
            <Typography variant="h6">
              {currencyFmt.format(Number(orderItems?.total ?? 0))}
            </Typography>
          </Stack>
        </Paper>

        {/* EMAIL / LOGIN */}
        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Podaci za obaveštenja
          </Typography>

          <CustomerEmailInput
            email={customerNotificationEmail}
            setEmail={setCustomerNotificationEmail}
            isLoggedIn={isLoggedIn}
          />
        </Paper>

        {/* CTA */}
        <Box mt={4}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
            {dirty && (
              <Typography variant="body2" color="warning.main" textAlign="right">
                Sačuvajte ili poništite izmene pre plaćanja.
              </Typography>
            )}

            {!canProceedToPayment && (
              <Typography variant="caption" color="error">
                Unesite email ili se ulogujte da biste nastavili.
              </Typography>
            )}

            <Button
              onClick={() => router.push('/home/checkout')}
              variant="contained"
              size="large"
              disabled={dirty || !canProceedToPayment}
            >
              Plaćanje
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
