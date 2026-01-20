'use client';

import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Analytics } from '@/components/admin/analytics';
import { OrderManagement } from '@/components/admin/order-management';
import { PricingSettings } from '@/components/admin/pricing-settings';
import { ShopSettings } from '@/components/admin/shop-settings';
import { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Analytics />;
      case 'orders':
        return <OrderManagement />;
      case 'pricing':
        return <PricingSettings />;
      case 'settings':
        return <ShopSettings />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
