'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCartItemCount } from '../hooks/useCartItemCount';
import CartButton from './ui/CartButton';

export function Header() {
  const initialOrderId =
    typeof window !== 'undefined' ? (localStorage.getItem('order_code') ?? undefined) : undefined;
  const [orderId, setOrderId] = useState<string | undefined>(initialOrderId);
  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);

  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: cartCounter } = useCartItemCount(orderId);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');

    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setUser(null);
    setAdmin(null);
    router.push('/');
  };

  return (
    <AppBar position="static" color="default" sx={{ borderBottom: 2, borderColor: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <Typography variant="caption" color="primary.contrastText" fontWeight="bold">
              G2C
            </Typography>
          </Avatar>
          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
            sx={{ cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            Go2Copy
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={isMobile ? 0 : 2}>
          <Button
            variant="text"
            size="small"
            onClick={() => router.push('/login')}
            startIcon={<User size={16} />}
          >
            {!isMobile && 'Za kopirnice'}
          </Button>
          <CartButton quantity={cartCounter?.count ?? 0} onClick={() => router.push('/cart')} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
