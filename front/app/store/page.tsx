'use client';

import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { OrderManagement } from '@/components/admin/order-management';
import { PricingSettings } from '@/components/admin/pricing-settings';
import { ShopSettings } from '@/components/admin/shop-settings';
import { OrderNotificationsListener } from '@/components/order-notifications-listener';
import { PusherProvider } from '@/context/PusherContext';
import { useMyPrintShop } from '@/hooks/useMyPrintShop';
import { useProductTemplates } from '@/hooks/useProductTemplates';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ShoppingCart, DollarSign, Settings } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function StorePage() {
  const { t } = useTranslation();

  const menuItems = useMemo(
    () => [
      {
        id: 'orders',
        label: t('store.tabs.orders'),
        icon: <ShoppingCart size={20} />,
        disabled: false,
        needsAttention: false,
      },
      {
        id: 'pricing',
        label: t('store.tabs.pricing'),
        icon: <DollarSign size={20} />,
        disabled: false,
        needsAttention: false,
      },
      {
        id: 'settings',
        label: t('store.tabs.settings'),
        icon: <Settings size={20} />,
        disabled: false,
        needsAttention: false,
      },
    ],
    [t],
  );

  const [activeTab, setActiveTab] = useState('orders');
  const [menuItemsState, setMenuItemsState] = useState(menuItems);

  useEffect(() => {
    // Sync translated initial state if items get updated
    setMenuItemsState((prev) =>
      prev.map((item) => ({
        ...item,
        label: menuItems.find((m) => m.id === item.id)?.label || item.label,
      })),
    );
  }, [menuItems]);

  const { data: shop, isLoading: isShopLoading } = useMyPrintShop();
  const { data: templates = [], isLoading: isTemplatesLoading } = useProductTemplates();

  useEffect(() => {
    if (isShopLoading || isTemplatesLoading) return;

    if (!shop) {
      setActiveTab('settings');

      setMenuItemsState((prev) =>
        prev.map((m) => ({
          ...m,
          disabled: m.id === 'orders' || m.id === 'pricing',
          needsAttention: m.id === 'settings',
        })),
      );

      return;
    }

    const hasAnyActivePricing = templates.some((t) => t.pricing && t.pricing.is_active);

    if (!hasAnyActivePricing) {
      setActiveTab('pricing');

      setMenuItemsState((prev) =>
        prev.map((m) => ({
          ...m,
          disabled: m.id === 'orders',
          needsAttention: m.id === 'pricing',
        })),
      );

      return;
    }

    setMenuItemsState((prev) =>
      prev.map((m) => ({
        ...m,
        disabled: false,
        needsAttention: false,
      })),
    );
  }, [shop, templates, isShopLoading, isTemplatesLoading]);

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrderManagement />;
      case 'pricing':
        return <PricingSettings templates={templates} isLoading={isTemplatesLoading} />;
      case 'settings':
        return <ShopSettings shop={shop} isLoading={isShopLoading} />;
      default:
        return <OrderManagement />;
    }
  };

  if (isShopLoading || isTemplatesLoading)
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 40%, #f1f5f9 100%)',
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.7)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <CircularProgress
            size={40}
            sx={{
              color: '#f97316',
            }}
          />
          <Typography
            sx={{
              mt: 2,
              fontSize: '0.9rem',
              color: 'text.secondary',
            }}
          >
            {t('store.loading')}
          </Typography>
        </Box>
      </Box>
    );

  return (
    <PusherProvider printShopId={shop?.id}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          overflow: 'hidden', // 🔥 sprečava globalni scroll
        }}
      >
        {/* HEADER */}
        <AdminHeader shopInfo={shop} />

        {/* SIDEBAR + CONTENT */}
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden', // 🔥 bitno
          }}
        >
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            menuItems={menuItemsState}
          />

          {/* SAMO OVO SE SKROLUJE */}
          <Box
            component="main"
            sx={{
              flex: 1,
              p: 3,
              overflow: 'auto', // 🔥 ovde je scroll
            }}
          >
            {renderContent()}
          </Box>

          <OrderNotificationsListener />
        </Box>
      </Box>
    </PusherProvider>
  );
}
