import { useMutation, useQueryClient } from '@tanstack/react-query';
import { strapiService } from '../services/strapiService';

type UpsertPricingPayload = {
    product_template: number;
    base_price: number;
    option_price_modifiers: any;
    is_active?: boolean;
};

export function useUpsertProductPricing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpsertPricingPayload) =>
            strapiService.upsertProductPricing(payload),

        onSuccess: () => {
            // refetch templejte sa pricingom
            queryClient.invalidateQueries({
                queryKey: ['product-templates'],
            });
        },
    });
}