'use client';

import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

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
