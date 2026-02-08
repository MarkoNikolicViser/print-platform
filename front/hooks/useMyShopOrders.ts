import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';

export function useMyShopOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const data = await strapiService.getMyShopOrders();
            return data;
        },
        staleTime: 60 * 1000, // 1 minut (orders su "življi" od template-a)
        refetchOnWindowFocus: true,
    });
}
