import { useQuery } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';
import type { CopyShop, PrintOptions } from '../types';

type UseCopyShopsParams = {
  selectedTemplate?: number | undefined;
  quantity?: number;
  memoizedConfig?: PrintOptions | string;
  numberOfPages?: number; // Defaults to 3 to match your current call
  enabled?: boolean;
};

export function useCopyShops({
  selectedTemplate,
  quantity,
  memoizedConfig,
  numberOfPages = 3,
  enabled = true,
}: UseCopyShopsParams) {
  const templateId = selectedTemplate ?? null;

  return useQuery<CopyShop[], Error>({
    queryKey: ['copyShops', memoizedConfig, quantity],
    enabled,
    refetchOnWindowFocus: false,
    queryFn: () =>
      !templateId
        ? strapiService.getCopyShops()
        : strapiService.getCopyShops(templateId, numberOfPages, quantity, memoizedConfig),
  });
}
