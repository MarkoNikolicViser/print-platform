import { useMutation, useQueryClient } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { CopyShop } from '../types';
import { toast } from 'react-toastify';

type CreatePrintShopPayload = Partial<
    Pick<CopyShop, 'name' | 'address' | 'city' | 'phone' | 'working_hours' | 'latitude' | 'longitude'>
>;

export function useCreateMyPrintShop() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePrintShopPayload) =>
            strapiService.createMyPrintShop(payload),

        onSuccess: (data) => {
            toast('Podaci kopirnice su sačuvani', { type: 'success' });

            // 🔁 update cache
            queryClient.setQueryData(['my-print-shop'], data);
            queryClient.invalidateQueries({
                queryKey: ['product-templates'],
            })
        },

        onError: (error) => {
            console.error('Create print shop failed:', error);
            toast('Greška pri čuvanju podataka', { type: 'error' });
        },
    });
}