import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { CopyShop } from '../types';

export function useMyPrintShop() {
    return useQuery<CopyShop>({
        queryKey: ['my-print-shop'],
        queryFn: () => strapiService.getMyPrintShop(),
        staleTime: 1000 * 60 * 5, // 5 min
        retry: false,
    });
}