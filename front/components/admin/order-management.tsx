'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Search, Clock, CheckCircle, Mail, Eye, Filter } from 'lucide-react';
import { useState } from 'react';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  fileName: string;
  pages: number;
  quantity: number;
  copies: number;
  isColor: boolean;
  isDoubleSided: boolean;
  binding: string;
  amount: number;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedCompletion: string;
}

const mockOrders: Order[] = [
  {
    id: 'PS1234567',
    customer: 'Ana Marković',
    email: 'ana.markovic@email.com',
    phone: '+381 64 123-4567',
    fileName: 'prezentacija.pdf',
    pages: 15,
    quantity: 2,
    copies: 1,
    isColor: true,
    isDoubleSided: false,
    binding: 'spiral',
    amount: 450,
    status: 'pending',
    createdAt: '2024-01-15 14:30',
    estimatedCompletion: '2024-01-15 16:00',
  },
  {
    id: 'PS1234568',
    customer: 'Petar Nikolić',
    email: 'petar.nikolic@email.com',
    phone: '+381 63 987-6543',
    fileName: 'dokument.docx',
    pages: 8,
    quantity: 1,
    copies: 3,
    isColor: false,
    isDoubleSided: true,
    binding: 'staple',
    amount: 120,
    status: 'processing',
    createdAt: '2024-01-15 13:15',
    estimatedCompletion: '2024-01-15 15:30',
  },
  {
    id: 'PS1234569',
    customer: 'Milica Jovanović',
    email: 'milica.jovanovic@email.com',
    phone: '+381 65 456-7890',
    fileName: 'katalog.pdf',
    pages: 24,
    quantity: 1,
    copies: 1,
    isColor: true,
    isDoubleSided: true,
    binding: 'thermal',
    amount: 680,
    status: 'ready',
    createdAt: '2024-01-15 11:45',
    estimatedCompletion: '2024-01-15 14:00',
  },
  {
    id: 'PS1234570',
    customer: 'Stefan Popović',
    email: 'stefan.popovic@email.com',
    phone: '+381 62 321-0987',
    fileName: 'izvestaj.pdf',
    pages: 12,
    quantity: 3,
    copies: 1,
    isColor: false,
    isDoubleSided: false,
    binding: 'none',
    amount: 180,
    status: 'completed',
    createdAt: '2024-01-14 16:20',
    estimatedCompletion: '2024-01-14 18:00',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
    case 'pending':
      return <Chip label="Na čekanju" sx={{ bgcolor: '#FFE0B2', color: '#E65100' }} />;
    case 'processing':
      return <Chip label="U obradi" sx={{ bgcolor: '#BBDEFB', color: '#0D47A1' }} />;
    case 'ready':
      return <Chip label="Spremno" sx={{ bgcolor: '#FFF9C4', color: '#F57F17' }} />;
    case 'completed':
      return <Chip label="Završeno" sx={{ bgcolor: '#C8E6C9', color: '#1B5E20' }} />;
    case 'cancelled':
      return <Chip label="Otkazano" sx={{ bgcolor: '#FFCDD2', color: '#B71C1C' }} />;
    default:
      return <Chip label={status} variant="outlined" />;
  }
};

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.fileName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    );

    // Send email notification (simulated)
    const order = orders.find((o) => o.id === orderId);
    if (order && newStatus === 'ready') {
      console.log(`Sending email to ${order.email}: Your order ${orderId} is ready for pickup!`);
    }
  };

  const sendNotification = (order: Order) => {
    console.log(`Sending notification to ${order.email} for order ${order.id}`);
    // In a real app, this would send an actual email
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      {/* Header */}
      <Box>
        <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
          Upravljanje narudžbinama
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pratite i upravljajte svim narudžbinama
        </Typography>
      </Box>

      {/* Filters */}
      <Card>
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box flex={1} minWidth={200} position="relative">
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 10,
                  transform: 'translateY(-50%)',
                  color: '#888',
                }}
              />
              <TextField
                placeholder="Pretražite narudžbine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{ pl: 4 }}
              />
            </Box>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">Svi statusi</MenuItem>
              <MenuItem value="pending">Na čekanju</MenuItem>
              <MenuItem value="processing">U obradi</MenuItem>
              <MenuItem value="ready">Spremno</MenuItem>
              <MenuItem value="completed">Završeno</MenuItem>
              <MenuItem value="cancelled">Otkazano</MenuItem>
            </Select>
          </Box>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Grid container spacing={2}>
        {filteredOrders.map((order) => (
          <Grid size={{ xs: 12 }} key={order.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="subtitle1" color="primary" fontWeight="bold">
                        {order.customer}
                      </Typography>
                      {getStatusBadge(order.status)}
                      <Chip label={order.id} variant="outlined" size="small" />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Kontakt:
                        </Typography>
                        <Typography variant="body2">{order.email}</Typography>
                        <Typography variant="body2">{order.phone}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Detalji:
                        </Typography>
                        <Typography variant="body2">Fajl: {order.fileName}</Typography>
                        <Typography variant="body2">
                          {order.pages} str × {order.copies} kopija × {order.quantity} primeraka
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          {order.isColor && <Chip label="Boja" size="small" variant="outlined" />}
                          {order.isDoubleSided && (
                            <Chip label="Obostrano" size="small" variant="outlined" />
                          )}
                          {order.binding !== 'none' && (
                            <Chip label={order.binding} size="small" variant="outlined" />
                          )}
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Vreme:
                        </Typography>
                        <Typography variant="body2">Naručeno: {order.createdAt}</Typography>
                        <Typography variant="body2">
                          Završetak: {order.estimatedCompletion}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box textAlign="right" ml={2}>
                    <Typography variant="h6" color="primary" fontWeight="bold" mb={1}>
                      {order.amount} RSD
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {order.status === 'pending' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                        >
                          <Clock size={16} style={{ marginRight: 4 }} />
                          Počni
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                        >
                          <CheckCircle size={16} style={{ marginRight: 4 }} />
                          Završi
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                        >
                          Preuzeto
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => sendNotification(order)}
                      >
                        <Mail size={16} style={{ marginRight: 4 }} />
                        Obavesti
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={16} style={{ marginRight: 4 }} />
                        Detalji
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Orders Message */}
      {filteredOrders.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Filter size={32} color="#888" style={{ marginBottom: 8 }} />
          <Typography variant="body2" color="text.secondary">
            Nema narudžbina koje odgovaraju kriterijumima
          </Typography>
        </Card>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={true} onClose={() => setSelectedOrder(null)} fullWidth maxWidth="md">
          <DialogTitle
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6" color="primary">
              Detalji narudžbine {selectedOrder.id}
            </Typography>
            <Button variant="outlined" onClick={() => setSelectedOrder(null)}>
              Zatvori
            </Button>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Informacije o korisniku
                </Typography>
                <Typography>
                  <strong>Ime:</strong> {selectedOrder.customer}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedOrder.email}
                </Typography>
                <Typography>
                  <strong>Telefon:</strong> {selectedOrder.phone}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Detalji štampanja
                </Typography>
                <Typography>
                  <strong>Fajl:</strong> {selectedOrder.fileName}
                </Typography>
                <Typography>
                  <strong>Stranica:</strong> {selectedOrder.pages}
                </Typography>
                <Typography>
                  <strong>Količina:</strong> {selectedOrder.quantity} primeraka
                </Typography>
                <Typography>
                  <strong>Kopije:</strong> {selectedOrder.copies} po primeru
                </Typography>
                <Typography>
                  <strong>Boja:</strong> {selectedOrder.isColor ? 'Da' : 'Ne'}
                </Typography>
                <Typography>
                  <strong>Obostrano:</strong> {selectedOrder.isDoubleSided ? 'Da' : 'Ne'}
                </Typography>
                <Typography>
                  <strong>Povezivanje:</strong> {selectedOrder.binding}
                </Typography>
                <Typography>
                  <strong>Ukupno:</strong> {selectedOrder.amount} RSD
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
