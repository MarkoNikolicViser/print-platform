'use client';

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
import { useMyShopOrders } from '@/hooks/useMyShopOrders';
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

const getStatusBadge = (status: string) => {
  const map: Record<string, { label: string; color: string }> = {
    paid: { label: 'Plaćeno', color: '#2e7d32' },
    printing: { label: 'Štampa', color: '#f9a825' },
    ready: { label: 'Spremno', color: '#ef6c00' },
    picked_up: { label: 'Preuzeto', color: '#2e7d32' },
    cancelled: { label: 'Otkazano', color: '#c62828' },
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
        Upravljanje porudžbinama
      </Typography>

      {/* Filters */}
      {!isNoResults && (
        <Card>
          <CardContent sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Pretraga..."
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
              <MenuItem value="all">Svi statusi</MenuItem>
              <MenuItem value="paid">Plaćeno</MenuItem>
              <MenuItem value="printing">Štampa</MenuItem>
              <MenuItem value="ready">Spremno</MenuItem>
              <MenuItem value="picked_up">Preuzeto</MenuItem>
              <MenuItem value="cancelled">Otkazano</MenuItem>
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
                        {order.customer_email ?? 'Nepoznat korisnik'}
                      </Typography>
                      {getStatusBadge(order.status_code)}
                      <Chip label={order.order_code} size="small" variant="outlined" />
                    </Stack>

                    <Typography variant="body2" mt={1}>
                      Ukupno: <strong>{order.total_price} RSD</strong>
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
                        Gotovo
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
                        Odbij
                      </Button>
                    )}

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Eye size={16} />}
                      onClick={() => setSelectedOrder(order)}
                    >
                      Detalji
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isNoResults && (
        <NoOrdersEmptyState
          isTrulyEmpty={isTrulyEmpty}
          onPrimaryAction={() => {
            if (isTrulyEmpty) {
              // e.g. route to product create page
              // router.push('/shop/products/new')
              console.log('Go add product');
            } else {
              // broaden search suggestion: clear search term only
              setSearchTerm('');
            }
          }}
        />
      )}

      {/* DETAILS MODAL */}
      {selectedOrder && (
        <Dialog open onClose={() => setSelectedOrder(null)} fullWidth maxWidth="md">
          <DialogTitle>Porudžbina {selectedOrder.order_code}</DialogTitle>
          <DialogContent dividers>
            {(selectedOrder.items ?? []).map((item) => (
              <Box key={item.id} mb={3}>
                <Typography fontWeight="bold">{item.product_template?.name}</Typography>

                <Typography variant="body2">Fajl: {item.document_name}</Typography>

                <Button
                  size="small"
                  startIcon={<Download size={16} />}
                  onClick={() => handleDownload(item.document_url, item.document_name)}
                >
                  Preuzmi fajl
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
