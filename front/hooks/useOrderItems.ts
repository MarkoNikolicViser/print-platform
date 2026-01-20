import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import { ApiError, Order, OrderItem } from '@/types';

export function useOrderItems(orderId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['order-items'],
    queryFn: (): Promise<Order[] | ApiError> => {
      if (!orderId) throw new Error('orderId is required');
      return strapiService.getOrderItems(orderId);
    },
    enabled: !!orderId && enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
