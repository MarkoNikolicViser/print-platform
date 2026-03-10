import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';

export function useCartItemCount(enabled: boolean = true) {
  const orderId = localStorage.getItem('order_code') || ''
  return useQuery<{ orderId: string; count: number }>({
    queryKey: ['cart-item-count'],
    queryFn: () => {
      if (!orderId) {
        throw new Error('orderId is required');
      }

      return strapiService.getCartItemCount(orderId);
    },
    enabled: enabled && !!orderId,
    staleTime: 60 * 1000, // 1 min (može i kraće)
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
