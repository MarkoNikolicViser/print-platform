import { useMutation, useQueryClient } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { AddToCartPayload, Order } from '../types';
import { toast } from 'react-toastify';

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddToCartPayload): Promise<Order> => {
      const response = await strapiService.addToCart(payload);
      if (!response) {
        throw new Error('Failed to add item to cart');
      }
      return response;
    },

    onSuccess: (data) => {
      toast(`Dodato u korpu`, {
        type: 'success',
      });
      const { orderId, count, total, expiresAt, items } = data;

      // 1️⃣ localStorage
      localStorage.setItem('order_code', orderId);

      // 2️⃣ CART COUNT
      queryClient.setQueryData(['cart-item-count'], {
        orderId,
        count,
      });

      // 3️⃣ ORDER ITEMS (isti shape kao itemsByOrder)
      queryClient.setQueryData(['order-items'], {
        orderId,
        count,
        total,
        expiresAt,
        items,
      });
    },

    onError: (error) => {
      console.error('Add to cart failed:', error);
    },
  });
}
