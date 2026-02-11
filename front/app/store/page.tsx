'use client';

import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { OrderManagement } from '@/components/admin/order-management';
import { PricingSettings } from '@/components/admin/pricing-settings';
import { ShopSettings } from '@/components/admin/shop-settings';
import { OrderNotificationsListener } from '@/components/order-notifications-listener';
import { PusherProvider } from '@/context/PusherContext';
import { Box } from '@mui/material';
import { useState } from 'react';

export default function StorePage() {
  const [activeTab, setActiveTab] = useState('orders');

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrderManagement />;
      case 'pricing':
        return <PricingSettings />;
      case 'settings':
        return <ShopSettings />;
      default:
        return <OrderManagement />;
    }
  };

  return (
    <PusherProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AdminHeader />
        <Box sx={{ display: 'flex' }}>
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <Box component="main" sx={{ flex: 1, p: 3 }}>
            {renderContent()}
          </Box>
          <OrderNotificationsListener />
        </Box>
      </Box>
    </PusherProvider>
  );
}
