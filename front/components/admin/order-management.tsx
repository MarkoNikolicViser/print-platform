'use client';

import { useMyShopOrders } from '@/hooks/useMyShopOrders';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { Search, Eye, Download, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NoOrdersEmptyState } from '../ui/NoOrdersEmptyState';

interface SelectedOptionWithLabel {
  key: string;
  value: any;
  label: string;
  optionLabel: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status_code: string;
  document_name: string;
  document_url: string;
  selected_options_with_labels?: SelectedOptionWithLabel[];
  product_template: {
    id: string;
    name: string;
  } | null;
}

interface Order {
  id: string;
  order_code: string;
  status_code: string;
  total_price: number;
  customer_email?: string;
  customer_phone?: string;
  createdAt: string;
  items: OrderItem[];
}

const getStatusBadge = (status: string, t: (key: string) => string) => {
  const map: Record<string, { label: string; color: string }> = {
    paid: { label: t('admin.orders.status.paid'), color: '#2e7d32' },
    printing: { label: t('admin.orders.status.printing'), color: '#f9a825' },
    ready: { label: t('admin.orders.status.ready'), color: '#ef6c00' },
    picked_up: { label: t('admin.orders.status.pickedUp'), color: '#2e7d32' },
    cancelled: { label: t('admin.orders.status.cancelled'), color: '#c62828' },
  };

  const cfg = map[status];
  return (
    <Chip
      label={cfg?.label ?? status}
      sx={{
        bgcolor: cfg ? `${cfg.color}22` : undefined,
        color: cfg?.color,
      }}
      size="small"
    />
  );
};

export function OrderManagement() {
  const { t } = useTranslation();
  const { data: orders = [], isLoading } = useMyShopOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_email ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status_code === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const isTrulyEmpty = orders.length === 0;
  const isNoResults = filteredOrders.length === 0;

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.click();
  };

  /** TODO: poveži sa mutation hook-om */
  const markAsReady = (orderId: string) => {
    console.log('MARK READY', orderId);
  };

  const cancelOrder = (orderId: string) => {
    console.log('CANCEL ORDER', orderId);
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Typography variant="h5" fontWeight="bold">
        {t('admin.orders.title')}
      </Typography>

      {/* Filters */}
      {!isNoResults && (
        <Card>
          <CardContent sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder={t('admin.orders.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search size={16} />,
              }}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">{t('admin.orders.allStatuses')}</MenuItem>
              <MenuItem value="paid">{t('admin.orders.status.paid')}</MenuItem>
              <MenuItem value="printing">{t('admin.orders.status.printing')}</MenuItem>
              <MenuItem value="ready">{t('admin.orders.status.ready')}</MenuItem>
              <MenuItem value="picked_up">{t('admin.orders.status.pickedUp')}</MenuItem>
              <MenuItem value="cancelled">{t('admin.orders.status.cancelled')}</MenuItem>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Orders */}
      <Grid container spacing={2}>
        {filteredOrders.map((order) => (
          <Grid size={{ xs: 12 }} key={order.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight="bold">
                        {order.customer_email ?? t('admin.orders.unknownUser')}
                      </Typography>
                      {getStatusBadge(order.status_code, t)}
                      <Chip label={order.order_code} size="small" variant="outlined" />
                    </Stack>

                    <Typography variant="body2" mt={1}>
                      {t('admin.orders.total')}: <strong>{order.total_price} RSD</strong>
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    {['paid', 'printing'].includes(order.status_code) && (
                      <Button
                        size="small"
                        color="success"
                        variant="outlined"
                        startIcon={<CheckCircle size={16} />}
                        onClick={() => markAsReady(order.id)}
                      >
                        {t('admin.orders.done')}
                      </Button>
                    )}

                    {order.status_code !== 'cancelled' && order.status_code !== 'picked_up' && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<XCircle size={16} />}
                        onClick={() => cancelOrder(order.id)}
                      >
                        {t('admin.orders.reject')}
                      </Button>
                    )}

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Eye size={16} />}
                      onClick={() => setSelectedOrder(order)}
                    >
                      {t('admin.orders.details')}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isNoResults && <NoOrdersEmptyState />}

      {/* DETAILS MODAL */}
      {selectedOrder && (
        <Dialog open onClose={() => setSelectedOrder(null)} fullWidth maxWidth="md">
          <DialogTitle>
            {t('admin.orders.order')} {selectedOrder.order_code}
          </DialogTitle>
          <DialogContent dividers>
            {(selectedOrder.items ?? []).map((item) => (
              <Box key={item.id} mb={3}>
                <Typography fontWeight="bold">{item.product_template?.name}</Typography>

                <Typography variant="body2">
                  {t('admin.orders.file')}: {item.document_name}
                </Typography>

                <Button
                  size="small"
                  startIcon={<Download size={16} />}
                  onClick={() => handleDownload(item.document_url, item.document_name)}
                >
                  {t('admin.orders.downloadFile')}
                </Button>

                <Stack spacing={0.5}>
                  {item.selected_options_with_labels?.map((opt) => (
                    <Typography key={opt.key} variant="body2">
                      <strong>{opt.label}:</strong> {opt.optionLabel}
                    </Typography>
                  ))}
                </Stack>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
