'use strict';

export default ({ strapi }: { strapi: any }) => ({

    async calculate({
        productTemplateId,
        printShopId,
        selectedOptions,
        quantity,
        numberOfPages
    }: {
        productTemplateId: number;
        printShopId: number;
        selectedOptions: Record<string, any>;
        quantity: number;
        numberOfPages?: number
    }) {
        // 1️⃣ Find pricing for the product template + print shop
        const pricing = await strapi.db
            .query('api::print-shop-product-pricing.print-shop-product-pricing')
            .findOne({
                where: {
                    product_template: productTemplateId,
                    print_shop: printShopId
                }
            });

        if (!pricing) {
            throw new Error('Pricing not found');
        }

        // 2️⃣ Calculate unit price
        let unit = Number(pricing.base_price);

        for (const [key, value] of Object.entries(selectedOptions)) {
            if (pricing.option_price_modifiers?.[key]?.[value]) {
                unit += Number(pricing.option_price_modifiers[key][value]);
            }
        }

        // 3️⃣ Return pricing info
        const pages = Number(numberOfPages) || 1;

        return {
            unit_price: unit,
            total_price: unit * Number(quantity) * pages,
            estimated_minutes: pricing.avg_completion_minutes || null
        };
    }
});
