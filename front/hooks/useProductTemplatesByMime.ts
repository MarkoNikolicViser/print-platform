import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { ProductTemplate } from '../types';

export function useProductTemplatesByMime(documentMimes?: string[], enabled: boolean = true) {
  return useQuery<ProductTemplate[]>({
    queryKey: ['product-templates', documentMimes],
    queryFn: () => {
      if (!documentMimes || documentMimes.length === 0) {
        throw new Error('documentMimes is required');
      }
      return strapiService.getProductTemplatesByMime(documentMimes);
    },
    enabled: enabled && !!documentMimes && documentMimes.length > 0,
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: false,
  });
}