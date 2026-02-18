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
  useMediaQuery,
  useTheme,
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
import GoogleOneTapButton from './ui/GoogleOneTapButton';

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
      <GoogleOneTapButton />
      <Divider>ILI</Divider>
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
        size="small"
      />

    </Stack>
  );
});

export default function CartItemsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px

  const router = useRouter();
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [customerNotificationEmail, setCustomerNotificationEmail] = useState('');

  useEffect(() => {
    const customersEmail = localStorage.getItem('customer_email')
    setCustomerNotificationEmail(customersEmail || '')
  }, [])

  const isLoggedIn = false; // TODO: zameni realnom auth logikom
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerNotificationEmail);
  const canProceedToPayment = isLoggedIn || isEmailValid;

  const { mutate: syncCart, isPending: isLoadingSync } = useSyncCart();
  const { data: orderItems, isLoading, isError, error } = useOrderItems(orderId);

  const serverItems = useMemo(() => (orderItems?.items as OrderItem[]) ?? [], [orderItems]);

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
    setEdited((prev) => prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it)));
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

  const containerMaxWidth = { xs: '100%', md: 'md' as const };

  return (
    <Box
      maxWidth={containerMaxWidth}
      mx="auto"
      mt={{ xs: 2, md: 4 }}
      px={{ xs: 1.5, md: 2 }}
      pb={{ xs: 10, md: 4 }} // extra bottom space so sticky CTA doesn't cover content
    >
      <Box sx={{ p: { xs: 1.5, md: 2 } }}>
        {/* Header Actions — hidden on small screens to avoid duplication with sticky bar */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{
            mb: { xs: 1.5, md: 2 },
            display: { xs: 'none', md: 'flex' }, // <-- hide on xs/sm
          }}
        >
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

        {/* On mobile, we still want a title (without buttons) */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1.5 }}>
          <Typography variant="h6">Stavke narudžbine</Typography>
          {dirty && changed.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Izmenjeno: {changed.join(', ')}
            </Typography>
          )}
        </Box>

        {/* Items */}
        <Stack spacing={{ xs: 1.5, md: 2 }}>
          {edited.map((item) => (
            <Paper
              key={item.id}
              variant="outlined"
              sx={{
                p: { xs: 1.5, md: 2 },
                borderRadius: 2,
              }}
            >
              <Grid container spacing={{ xs: 1.5, md: 2 }}>
                {/* Left summary column */}
                <Grid item xs={12} md={4}>
                  <Stack spacing={0.5}>
                    {/* Title + preview chip */}
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      flexWrap="wrap"
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
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
                          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                        />
                      )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      • TIP: {item.document_mime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Usluga: {item.product_template.description}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Jedinična cena: <b>{currencyFmt.format(Number(item.unit_price))}</b>
                    </Typography>
                    <Typography variant="body2">
                      Ukupno za ovu stavku: <b>{currencyFmt.format(Number(item.total_price))}</b>
                    </Typography>

                    {/* Quantity + remove (responsive, never overflows) */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1, flexWrap: 'wrap' }} // allow wrap on small screens
                      alignItems="center"
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        −
                      </Button>
                      <Typography variant="body2" sx={{ minWidth: 88, textAlign: 'center' }}>
                        Količina: {item.quantity}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>

                      {/* spacer visible on sm+; on xs we move Remove to next line */}
                      <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />

                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemove(item.id)}
                        sx={{
                          ml: { sm: 'auto' },
                          mt: { xs: 1, sm: 0 }, // drop to next line on phones
                          width: { xs: '100%', sm: 'auto' }, // full-width on phones
                        }}
                      >
                        Ukloni
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>

                {/* Options column */}
                <Grid size={{ xs: 12 }}>
                  <Grid container spacing={{ xs: 1.5, md: 2 }}>
                    {Object.entries(item.allowed_options || {}).map(([key, option]) => (
                      <Grid key={key} size={{ xs: 12, sm: 6, md: 6 }}>
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

        {/* Total */}
        <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 }, mt: { xs: 1.5, md: 2 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600}>Ukupan iznos</Typography>
            <Typography variant={isMobile ? 'subtitle1' : 'h6'}>
              {currencyFmt.format(Number(orderItems?.total ?? 0))}
            </Typography>
          </Stack>
        </Paper>

        {/* EMAIL / LOGIN */}
        <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 }, mt: { xs: 2, md: 3 } }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            sx={{ mb: { xs: 1, md: 1.5 } }}
          >
            Podaci za obaveštenja
          </Typography>

          <CustomerEmailInput
            email={customerNotificationEmail}
            setEmail={setCustomerNotificationEmail}
            isLoggedIn={isLoggedIn}
          />
        </Paper>

        {/* Desktop CTA (only desktop) */}
        <Box mt={{ xs: 2, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
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

      {/* Sticky Mobile CTA (only mobile) */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (t) => t.zIndex.appBar,
          p: 1,
          display: { xs: 'block', md: 'none' },
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          backdropFilter: 'saturate(180%) blur(6px)',
        }}
      >
        <Stack spacing={1}>
          {dirty && (
            <Typography variant="caption" color="warning.main">
              Sačuvajte ili poništite izmene pre plaćanja.
            </Typography>
          )}
          {!canProceedToPayment && (
            <Typography variant="caption" color="error">
              Unesite email ili se ulogujte da biste nastavili.
            </Typography>
          )}

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={resetChanges}
              disabled={!dirty}
              fullWidth
              size="medium"
            >
              Poništi
            </Button>
            <Button
              variant="outlined"
              onClick={saveChanges}
              disabled={!dirty || isLoadingSync}
              fullWidth
              size="medium"
            >
              Sačuvaj
            </Button>
            <Button
              onClick={() => router.push('/home/checkout')}
              variant="contained"
              size="medium"
              disabled={dirty || !canProceedToPayment}
              fullWidth
            >
              Plaćanje
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
