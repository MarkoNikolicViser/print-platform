'use client';

import { OrderItem, SelectedOptions, AllowedOption } from '@/types';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import CropIcon from '@mui/icons-material/Crop';
import { useFileUpload } from '@/hooks/useFileUpload';
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
  IconButton,
  Collapse,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { renderOptionField } from '../components/ui/DynamicRenderOfFields';
import { useAuth } from '../context/AuthContext';
import { useDirtyCart } from '../hooks/useDirtyCart';
import { useOrderItems } from '../hooks/useOrderItems';
import { useSyncCart } from '../hooks/useSyncCart';
import EmptyCartState from './ui/EmptyCartState';
import ErrorState from './ui/error-state';
import GoogleOneTapButton from './ui/GoogleOneTapButton';
import { OrderItemsSkeleton } from './ui/OrderItemsSkeleton';
import { ImageCropperDialog } from './FileEditor/ImageCropperDialog';
import { toast } from 'react-toastify';
import { usePrintContext } from '@/context/PrintContext';
import { isItImage } from '@/helpers/formatters';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { X } from 'lucide-react';
import { CropIcon } from 'lucide-react';
import { FileText } from 'lucide-react';
/** Memoized email input component */
const CustomerEmailInput = React.memo(function CustomerEmailInput({
  email,
  setEmail,
  isLoggedIn,
  t,
}: {
  email: string;
  setEmail: (val: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
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
        {t('cart.notificationsLoggedIn')}
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <GoogleOneTapButton />
      <Divider>{t('cart.or')}</Divider>
      <TextField
        label={t('cart.notificationEmail')}
        type="email"
        value={email}
        onChange={handleChange}
        error={email.length > 0 && !isEmailValid}
        helperText={
          email.length > 0 && !isEmailValid ? t('cart.invalidEmail') : t('cart.emailHint')
        }
        fullWidth
        required
        size="small"
      />
    </Stack>
  );
});

export default function CartItemsSection() {
  const { t } = useTranslation();
  const { updateFileConfig } = usePrintContext()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const router = useRouter();
  const { uploadFile } = useFileUpload();

  const { user } = useAuth(); // <-- koristi auth context
  const isLoggedIn = Boolean(user);

  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [customerNotificationEmail, setCustomerNotificationEmail] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null | number>(null);
  // učitaj email iz localStorage samo ako nije logovan
  useEffect(() => {
    if (!isLoggedIn) {
      const customersEmail = localStorage.getItem('customer_email');
      setCustomerNotificationEmail(customersEmail || '');
    }
  }, [isLoggedIn]);

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
          ? { ...it, selected_options: { ...it.selected_options, [key]: value } }
          : it,
      ),
    );
  };

  const handleQuantityChange = (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    setEdited((prev) => prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it)));
  };

  const handleRemove = (id: number) => setEdited((prev) => prev.filter((it) => it.id !== id));
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


  const handleUploadCropped = useCallback(
    async (editedFile: File, fileId: number) => {
      try {
        const res = await uploadFile(editedFile);
        if (!res.success) {
          toast(t('home.printConfig.editError'), { type: 'error' });
          return;
        }
        const url = res.url ?? '';
        updateFileConfig(fileId, { url });
        toast(t('home.printConfig.editSuccess'), { type: 'success' });
      } catch {
        toast(t('home.printConfig.editError'), { type: 'error' });
      }
    },
    [uploadFile, updateFileConfig, t]
  );
  const toggle = (id: number | string | null) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  if (isLoading || !orderId) return <OrderItemsSkeleton />;
  if (isError) return <ErrorState queryKey={['order-items']} message={error.message} />;
  if (edited.length === 0) return <EmptyCartState ctaHref='/home' />;

  const containerMaxWidth = { xs: '100%', md: 'md' as const };

  return (
    <Box
      maxWidth={containerMaxWidth}
      mx="auto"
      mt={{ xs: 2, md: 4 }}
      px={{ xs: 1.5, md: 2 }}
      pb={{ xs: 10, md: 4 }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{ mb: { xs: 1.5, md: 2 }, display: { xs: 'none', md: 'flex' } }}
      >
        <Typography variant="h5" color='text.primary'>{t('cart.orderItems')}</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={resetChanges} disabled={!dirty}>
            {t('cart.resetChanges')}
          </Button>
          <Button variant="contained" onClick={saveChanges} disabled={!dirty || isLoadingSync}>
            {t('cart.saveChanges')}
          </Button>
        </Stack>
      </Stack>

      {/* Mobile Header */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1.5 }}>
        <Typography variant="h6" color='text.primary'>{t('cart.orderItems')}</Typography>
        {dirty && changed.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {t('cart.changed')}: {changed.join(', ')}
          </Typography>
        )}
      </Box>

      {/* Items */}
      <Stack spacing={{ xs: 1.5, md: 2 }}>
        {edited.map((item) => (
          <Paper key={item.id} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* HEADER */}
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              px={{ xs: 1.5, md: 2 }}
              py={1.2}
            >
              <FileText size={18} />

              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.document_name} ({item.document_pages} str.)
              </Typography>

              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ minWidth: 90, textAlign: 'right' }}
              >
                {currencyFmt.format(Number(item.total_price))}
              </Typography>

              {/* quantity */}
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
                  }
                >
                  −
                </IconButton>

                <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </IconButton>
              </Stack>

              {/* preview */}
              {item.document_url && (
                <IconButton
                  size="small"
                  onClick={() =>
                    window.open(item.document_url, '_blank', 'noopener,noreferrer')
                  }
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              )}

              {/* crop */}
              {isItImage(item.document_mime) && (
                <IconButton
                  size="small"
                  onClick={() => {
                    setImage(item.document_url);
                    setOpen(true);
                  }}
                >
                  <CropIcon size={16} />
                </IconButton>
              )}

              {/* remove */}
              <IconButton size="small" onClick={() => handleRemove(item.id)}>
                <X size={16} />
              </IconButton>

              {/* expand */}
              <IconButton size="small" onClick={() => toggle(item.id)}>
                <ExpandMoreIcon
                  sx={{
                    transform: openId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: '0.2s',
                  }}
                />
              </IconButton>
            </Box>

            {/* DETAILS */}
            <Collapse in={openId === item.id}>
              <Box px={{ xs: 1.5, md: 2 }} pb={2}>

                <Divider sx={{ mb: 1.5 }} />

                <Typography variant="body2" color="text.secondary">
                  TIP: {item.document_mime}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {t('cart.service')}: {item.product_template.description}
                </Typography>

                <Typography variant="body2">
                  {t('cart.unitPrice')}: <b>{currencyFmt.format(Number(item.unit_price))}</b>
                </Typography>

                {/* OPTIONS */}
                <Grid container spacing={{ xs: 1.5, md: 2 }} mt={0.5}>
                  {Object.entries(item.allowed_options || {}).map(([key, option]) => (
                    <Grid key={key} size={{ xs: 12, sm: 6 }}>
                      {renderOptionField(
                        item,
                        key as keyof SelectedOptions,
                        option as AllowedOption,
                        handleOptionChange
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>

            {/* CROP MODAL */}
            {image && (
              <ImageCropperDialog
                open={open}
                image={image}
                aspect={1}
                onComplete={(editedFile) =>
                  editedFile && handleUploadCropped(editedFile, item.id)
                }
                onClose={() => setOpen(false)}
              />
            )}
          </Paper>
        ))}
      </Stack>

      {/* Total */}
      <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 }, mt: { xs: 1.5, md: 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>{t('cart.totalAmount')}</Typography>
          <Typography variant={isMobile ? 'subtitle1' : 'h6'}>
            {currencyFmt.format(Number(orderItems?.total ?? 0))}
          </Typography>
        </Stack>
      </Paper>

      {/* Podaci za obaveštenja */}
      <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 }, mt: { xs: 2, md: 3 } }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{ mb: { xs: 1, md: 1.5 } }}
        >
          {t('cart.notificationInfo')}
        </Typography>

        <CustomerEmailInput
          email={customerNotificationEmail}
          setEmail={setCustomerNotificationEmail}
          isLoggedIn={isLoggedIn}
          t={t}
        />
      </Paper>

      {/* CTA */}
      <Box mt={{ xs: 2, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
          {dirty && (
            <Typography variant="body2" color="warning.main" textAlign="right">
              {t('cart.saveOrResetBeforePayment')}
            </Typography>
          )}
          {!canProceedToPayment && (
            <Typography variant="caption" color="error">
              {t('cart.emailOrLoginRequired')}
            </Typography>
          )}
          <Button
            onClick={() => router.push('/home/checkout')}
            variant="contained"
            size="large"
            disabled={dirty || !canProceedToPayment}
          >
            {t('cart.payment')} {currencyFmt.format(Number(orderItems?.total ?? 0))}
          </Button>
        </Stack>
      </Box>

      {/* Sticky Mobile CTA */}
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
              {t('cart.saveOrResetBeforePayment')}
            </Typography>
          )}
          {!canProceedToPayment && (
            <Typography variant="caption" color="error">
              {t('cart.emailOrLoginRequired')}
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
              {t('cart.reset')}
            </Button>
            <Button
              variant="outlined"
              onClick={saveChanges}
              disabled={!dirty || isLoadingSync}
              fullWidth
              size="medium"
            >
              {t('cart.save')}
            </Button>
            <Button
              onClick={() => router.push('/home/checkout')}
              variant="contained"
              size="medium"
              disabled={dirty || !canProceedToPayment}
              fullWidth
            >
              {t('cart.payment')} {currencyFmt.format(Number(orderItems?.total ?? 0))}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
