'use strict';

module.exports = {
    async upsert(ctx) {
        const printShopId = ctx.state.printShopId;

        const {
            product_template,
            base_price,
            option_price_modifiers,
            is_active = true,
        } = ctx.request.body;

        if (!product_template || base_price == null) {
            return ctx.badRequest('Missing required fields');
        }

        const query = strapi.db.query(
            'api::print-shop-product-pricing.print-shop-product-pricing'
        );

        const existing = await query.findOne({
            where: {
                print_shop: printShopId,
                product_template,
            },
        });

        let result;

        if (existing) {
            result = await query.update({
                where: { id: existing.id },
                data: {
                    base_price,
                    option_price_modifiers,
                    is_active,
                },
            });
        } else {
            result = await query.create({
                data: {
                    print_shop: printShopId,
                    product_template,
                    base_price,
                    option_price_modifiers,
                    is_active,
                },
            });
        }

        ctx.body = result;
    },
};