import { useMutation, useQueryClient } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import { toast } from 'react-toastify';

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await strapiService.logout();
        },

        onSuccess: () => {
            queryClient.clear();

            localStorage.removeItem('order_code');

            toast('Uspešno ste se izlogovali', {
                type: 'success',
            });
        },

        onError: (error) => {
            console.error('Logout failed:', error);

            strapiService.logout();

            toast('Došlo je do greške prilikom logout-a', {
                type: 'error',
            });
        },
    });
}
