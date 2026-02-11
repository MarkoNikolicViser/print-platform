import { useMutation } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import { toast } from 'react-toastify';
import { MarkPaidPayload } from '@/types';

export function useMarkOrderPaid() {
    return useMutation({
        mutationFn: async (payload: MarkPaidPayload) => {
            const ok = await strapiService.markOrderPaid(payload);
            if (!ok) {
                throw new Error('Payment confirmation failed');
            }
            return true;
        },

        onSuccess: () => {
            toast('Plaćanje uspešno 🎉', { type: 'success' });
            localStorage.removeItem('order_code');
        },

        onError: (err) => {
            console.error(err);
            toast('Greška pri potvrdi plaćanja', { type: 'error' });
        },
    });
}
