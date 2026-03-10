import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { CopyShop, PrintOptions } from '../types';

type UseCopyShopsParams = {
  selectedTemplate?: number;
  documents?: { pages?: number; name?: string; url?: string; mime?: string }[];
  quantity?: number;
  memoizedConfig?: PrintOptions | string;
  enabled?: boolean;
};

export function useCopyShops({
  selectedTemplate,
  documents = [],
  quantity = 1,
  memoizedConfig,
  enabled = true,
}: UseCopyShopsParams) {
  const templateId = selectedTemplate ?? null;

  return useQuery<CopyShop[], Error>({
    queryKey: ['copyShops', templateId, documents, quantity, memoizedConfig],
    enabled,
    refetchOnWindowFocus: false,
    queryFn: () =>
      !templateId
        ? strapiService.getCopyShops()
        : strapiService.getCopyShops(templateId, documents, quantity, memoizedConfig),
  });
}