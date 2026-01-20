import { useMutation, useQueryClient } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { SyncCartPayload } from '../types';
import { toast } from 'react-toastify';

export function useSyncCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SyncCartPayload) => {
      const response = await strapiService.syncCart(payload);
      if (!response) {
        throw new Error('Failed to sync cart');
      }
      return response;
    },

    onSuccess: (data) => {
      toast(`Azurirana korpa`, {
        type: 'success',
      });
      const { orderId, count, total, expiresAt, items } = data;

      localStorage.setItem('order_code', orderId);

      queryClient.setQueryData(['cart-item-count'], {
        orderId,
        count,
      });

      queryClient.setQueryData(['order-items'], {
        orderId,
        count,
        total,
        expiresAt,
        items,
      });
    },

    onError: (error) => {
      console.error('Sync cart failed:', error);
    },
  });
}
