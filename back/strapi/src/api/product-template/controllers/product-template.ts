'use strict';

module.exports = {
    async findByMime(ctx) {

        const { document_mime } = ctx.query;

        if (!document_mime || typeof document_mime !== 'string') {
            return ctx.badRequest('document_mime is required and must be string');
        }

        const templates = await strapi.entityService.findMany(
            'api::product-template.product-template',
            {
                filters: {
                    supported_mime: {
                        $contains: [document_mime] as any,
                    },
                },
                fields: ['id', 'name', 'description', 'icon', 'allowed_options'],
            }
        );

        ctx.send({ data: templates });
    },
    async findAll(ctx) {
        const printShopId = ctx.state.printShopId;

        if (!printShopId) {
            return ctx.forbidden('Print shop context missing');
        }

        /**
         * 1. Svi product template-i
         */
        const templates = await strapi.db
            .query('api::product-template.product-template')
            .findMany({
                orderBy: { name: 'asc' },
            });

        /**
         * 2. Svi pricing-i za taj shop
         */
        const pricings = await strapi.db
            .query('api::print-shop-product-pricing.print-shop-product-pricing')
            .findMany({
                where: {
                    print_shop: printShopId
                },
                populate: {
                    product_template: {
                        select: ['id'],
                    },
                },
            });

        /**
         * 3. Mapiranje pricinga po template ID-ju
         */
        const pricingByTemplateId = new Map<number, any>();

        pricings.forEach((pricing) => {
            pricingByTemplateId.set(pricing.product_template.id, pricing);
        });

        /**
         * 4. Spajanje u jedan response
         */
        return templates.map((template) => {
            const pricing = pricingByTemplateId.get(template.id);

            return {
                ...template,
                has_pricing: Boolean(pricing),
                pricing: pricing
                    ? {
                        id: pricing.id,
                        base_price: pricing.base_price,
                        option_price_modifiers: pricing.option_price_modifiers,
                        is_active: pricing.is_active,
                    }
                    : null,
            };
        });
    }
};
