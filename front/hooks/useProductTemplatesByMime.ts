import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { ProductTemplate } from '../types';

export function useProductTemplatesByMime(documentMime?: string, enabled: boolean = true) {
  return useQuery<ProductTemplate[]>({
    queryKey: ['product-templates', documentMime],
    queryFn: () => {
      if (!documentMime) {
        throw new Error('documentMime is required');
      }

      return strapiService.getProductTemplatesByMime(documentMime);
    },
    enabled: enabled && !!documentMime,
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: false,
  });
}
