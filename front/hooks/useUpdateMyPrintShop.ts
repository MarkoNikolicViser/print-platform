import { useMutation, useQueryClient } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { CopyShop } from '../types';
import { toast } from 'react-toastify';

type UpdatePrintShopPayload = Partial<
    Pick<CopyShop, 'name' | 'address' | 'city' | 'phone' | 'working_hours' | 'latitude' | 'longitude'>
>;

export function useUpdateMyPrintShop() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdatePrintShopPayload) =>
            strapiService.updateMyPrintShop(payload),

        onSuccess: (data) => {
            toast('Podaci kopirnice su sačuvani', { type: 'success' });

            // 🔁 update cache
            queryClient.setQueryData(['my-print-shop'], data);
        },

        onError: (error) => {
            console.error('Update print shop failed:', error);
            toast('Greška pri čuvanju podataka', { type: 'error' });
        },
    });
}