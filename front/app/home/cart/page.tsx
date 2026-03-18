'use client';

import CartItemsSection from '@/components/cart-items-section';
import { Header } from '@/components/header';
import { Box } from '@mui/material';

export default function CartPage() {
  return (
    <Box width={'100%'} minHeight={'100vh'} bgcolor="background.default">
      <Header />
      <CartItemsSection />
    </Box>
  );
}
