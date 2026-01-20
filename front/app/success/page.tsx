'use client';

import { Container, Paper, Typography, Box, Button, Alert } from '@mui/material';
import { CheckCircle, Printer as Print, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Mock order details based on orderId
    if (orderId) {
      setOrderDetails({
        id: orderId,
        shopName: 'Copy Shop Centar',
        shopAddress: 'Knez Mihailova 15, Beograd',
        estimatedTime: '30-45 minuta',
        contactPhone: '+381 11 123 4567',
      });
    }
  }, [orderId]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: '#1e3a8a', fontWeight: 600 }}
        >
          Porudžbina uspešno poslata!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Vaša porudžbina je primljena i obrađuje se. Uskoro ćete dobiti email potvrdu.
        </Typography>

        {orderDetails && (
          <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e3a8a' }}>
              Detalji porudžbine
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>ID porudžbine:</strong> {orderDetails.id}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Copy Shop:</strong> {orderDetails.shopName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Adresa:</strong> {orderDetails.shopAddress}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Procenjeno vreme:</strong> {orderDetails.estimatedTime}
            </Typography>
            <Typography variant="body2">
              <strong>Kontakt:</strong> {orderDetails.contactPhone}
            </Typography>
          </Box>
        )}

        <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="body2">
            <strong>Sledeći koraci:</strong>
          </Typography>
          <Typography variant="body2" component="div" sx={{ mt: 1 }}>
            1. Dobićete email potvrdu sa detaljima porudžbine
            <br />
            2. Copy shop će početi sa štampanjem
            <br />
            3. Kada bude gotovo, dobićete obaveštenje
            <br />
            4. Pokupite gotove kopije u copy shopu
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={() => router.push('/')}
            sx={{ bgcolor: '#f97316', '&:hover': { bgcolor: '#ea580c' } }}
          >
            Nova porudžbina
          </Button>

          {user && (
            <Button
              variant="outlined"
              startIcon={<User />}
              onClick={() => router.push('/profile')}
              sx={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}
            >
              Moj profil
            </Button>
          )}

          {!user && (
            <Button
              variant="outlined"
              startIcon={<User />}
              onClick={() => router.push('/login')}
              sx={{ color: '#1e3a8a', borderColor: '#1e3a8a' }}
            >
              Prijavite se
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
