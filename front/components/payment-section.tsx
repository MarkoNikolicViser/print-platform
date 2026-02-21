'use client';

import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Chip,
  Divider,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentSectionOrderSummary {
  shopName: string;
  totalCost: number;
  fileInfo: {
    name: string;
    pages: number;
  };
  printConfig: {
    quantity: number;
    isColor: boolean;
    isDoubleSided: boolean;
    binding: string;
  };
}

interface PaymentSectionProps {
  orderSummary: PaymentSectionOrderSummary;
  onPaymentComplete: (paymentId: string) => void;
  onCancel: () => void;
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Platna kartica',
    description: 'Visa, MasterCard, Dina',
    icon: <CreditCardIcon />,
    fee: 0,
    processingTime: 'Trenutno',
  },
  {
    id: 'mbanking',
    name: 'm-Banking',
    description: 'Komercijalna, Intesa, Raiffeisen',
    icon: <SmartphoneIcon />,
    fee: 0,
    processingTime: '1-2 min',
  },
  {
    id: 'bank_transfer',
    name: 'Bankovna doznaka',
    description: 'Prenos na račun štamparije',
    icon: <BusinessIcon />,
    fee: 0,
    processingTime: '1-24h',
  },
];

export function PaymentSection({ orderSummary, onPaymentComplete, onCancel }: PaymentSectionProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod);

  const totalWithFees = orderSummary.totalCost + (selectedPaymentMethod?.fee || 0);

  const handlePayment = () => {
    if (!selectedMethod) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);

      setTimeout(() => {
        onPaymentComplete(`PS${Date.now()}`);
      }, 2000);
    }, 3000);
  };

  if (paymentComplete) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold">
            {t('payment.successTitle')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {t('payment.successDescription')}
          </Typography>

          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography>ID: PS{Date.now()}</Typography>
            <Typography>
              {t('payment.shop')}: {orderSummary.shopName}
            </Typography>
            <Typography>
              {t('payment.total')}: {totalWithFees} RSD
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <LockIcon />
            <Typography variant="h6">{t('payment.title')}</Typography>
          </Stack>
        }
        subheader={t('payment.selectMethod')}
      />

      <CardContent>
        {/* ORDER SUMMARY */}
        <Box
          sx={{ p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 2, mb: 3 }}
        >
          <Typography fontWeight="bold" color="primary" mb={1}>
            {t('payment.orderSummary')}
          </Typography>

          <Stack spacing={1}>
            <Typography>
              {t('payment.shop')}: {orderSummary.shopName}
            </Typography>
            <Typography>
              {t('payment.file')}: {orderSummary.fileInfo.name}
            </Typography>
            <Typography>
              {t('payment.pages')}: {orderSummary.fileInfo.pages}
            </Typography>
            <Typography>
              {t('payment.copies')}: {orderSummary.printConfig.quantity}
            </Typography>

            <Stack direction="row" spacing={1}>
              {orderSummary.printConfig.isColor && <Chip label={t('payment.color')} size="small" />}
              {orderSummary.printConfig.isDoubleSided && (
                <Chip label={t('payment.doubleSided')} size="small" />
              )}
              {orderSummary.printConfig.binding !== 'none' && (
                <Chip label={t('payment.binding')} size="small" />
              )}
            </Stack>

            <Divider />

            <Typography fontWeight="bold">
              {t('payment.total')}: {totalWithFees} RSD
            </Typography>
          </Stack>
        </Box>

        {/* PAYMENT METHODS */}
        <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
          {paymentMethods.map((method) => (
            <FormControlLabel
              key={method.id}
              value={method.id}
              control={<Radio />}
              label={
                <Stack direction="row" spacing={2} alignItems="center">
                  {method.icon}
                  <Box>
                    <Typography fontWeight="medium">
                      {t(`payment.methods.${method.id}.name`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(`payment.methods.${method.id}.description`)}
                    </Typography>
                  </Box>
                </Stack>
              }
            />
          ))}
        </RadioGroup>

        {/* CARD DETAILS */}
        {selectedMethod === 'card' && (
          <Box sx={{ mt: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              {t('payment.cardDetails')}
            </Typography>

            <Stack spacing={2}>
              <TextField
                label={t('payment.cardName')}
                fullWidth
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              />
              <TextField
                label={t('payment.cardNumber')}
                fullWidth
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label={t('payment.cardExpiry')}
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                />
                <TextField
                  label={t('payment.cardCvv')}
                  type="password"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                />
              </Stack>
            </Stack>
          </Box>
        )}

        {/* BANK TRANSFER */}
        {selectedMethod === 'bank_transfer' && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            <WarningAmberIcon sx={{ mr: 1 }} />
            {t('payment.transferNotice')}
          </Alert>
        )}

        {/* ACTIONS */}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button variant="outlined" fullWidth onClick={onCancel}>
            {t('payment.cancel')}
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={!selectedMethod || isProcessing}
            onClick={handlePayment}
          >
            {isProcessing ? (
              <CircularProgress size={24} />
            ) : (
              `${t('payment.pay')} ${totalWithFees} RSD`
            )}
          </Button>
        </Stack>

        {/* SECURITY */}
        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ mt: 3 }}
          color="text.secondary"
        >
          <LockIcon sx={{ fontSize: 14, mr: 0.5 }} />
          {t('payment.sslNotice')}
        </Typography>
      </CardContent>
    </Card>
  );
}
