import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { ProductTemplate } from '../types';

export function useProductTemplates() {
    return useQuery<ProductTemplate[]>({
        queryKey: ['product-templates'],
        queryFn: async () => {
            const data = await strapiService.getProductTemplates();
            return data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}