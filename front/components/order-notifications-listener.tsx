'use client';

import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function OrderNotificationsListener() {
  const queryClient = useQueryClient();
  useOrderNotifications((order) => {
    queryClient.invalidateQueries({
      queryKey: ['orders'],
    });
    toast(`🆕 Novi order: ${order.orderCode}, total: ${order.total}€`, { type: 'info' });
  });

  return null;
}
