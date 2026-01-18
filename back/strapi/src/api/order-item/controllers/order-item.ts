'use strict';

import { calculatePrice } from "../../pricing/services/pricing";

module.exports = {

    async countByOrder(ctx) {
        const { orderId } = ctx.params;

        if (!orderId) return ctx.badRequest('orderId is required');

        const order = await strapi.db.query('api::order.order').findOne({
            where: { order_code: orderId, status_code: 'draft' },
            populate: { order_items: true },
        });

        if (!order) return ctx.notFound('Order not found');

        const orderItemService = strapi.service('api::order-item.order-item');

        if (orderItemService.isOrderExpired(order)) {
            ctx.status = 410;
            return ctx.send({ expired: true });
        }

        return ctx.send({
            orderId,
            count: order.order_items?.length || 0,
        });
    },

    async itemsByOrder(ctx) {
        const { orderId } = ctx.params;
        if (!orderId) return ctx.badRequest('orderId is required');

        const orderItemService = strapi.service('api::order-item.order-item');
        const response = await orderItemService.buildItemsByOrderResponse(orderId);

        if (!response) return ctx.notFound('Order not found');

        if (response.expired) {
            ctx.status = 410;
            return ctx.send(response);
        }

        return ctx.send(response);
    },

    async sync(ctx) {
        const { order_code, updated = [], created = [], deletedIds = [] } = ctx.request.body;
        if (!order_code) return ctx.badRequest('order_code is required');

        /** 1️⃣ ORDER + PRINT SHOP */
        const order = await strapi.db.query('api::order.order').findOne({
            where: { order_code, status_code: 'draft' },
            populate: { print_shop_id: true },
        });
        if (!order) return ctx.notFound('Draft order not found');
        if (!order.print_shop_id) return ctx.badRequest('Order does not have a print_shop assigned');

        const orderId = order.id;
        const printShopId = order.print_shop_id.id;

        /** 2️⃣ UPDATE ITEMS (SAMO PODACI, NE CENA) */
        for (const item of updated) {
            await strapi.db.query('api::order-item.order-item').update({
                where: { id: item.id, order: orderId },
                data: {
                    selected_options: item.selected_options,
                    quantity: item.quantity,
                },
            });
        }

        /** 3️⃣ CREATE ITEMS */
        for (const item of created) {
            await strapi.db.query('api::order-item.order-item').create({
                data: {
                    order: orderId,
                    product_template: item.product_template_id,
                    file: item.file_id,
                    selected_options: item.selected_options,
                    quantity: item.quantity,
                    document_pages: item.document_pages,
                    document_url: item.document_url,
                    document_name: item.document_name,
                    document_mime: item.document_mime,
                },
            });
        }

        /** 4️⃣ DELETE ITEMS */
        if (deletedIds.length) {
            await strapi.db.query('api::order-item.order-item').deleteMany({
                where: {
                    id: { $in: deletedIds },
                    order: orderId,
                },
            });
        }

        /** 5️⃣ JEDINA ISTINA – RECALC SVIH ITEM-a */
        const items = await strapi.db.query('api::order-item.order-item').findMany({
            where: { order: orderId },
            populate: { product_template: true },
        });

        let orderTotal = 0;

        for (const item of items) {
            if (!item.product_template) continue;

            const pricing = await strapi.db
                .query('api::print-shop-product-pricing.print-shop-product-pricing')
                .findOne({
                    where: {
                        print_shop: printShopId,
                        product_template: item.product_template.id,
                        is_active: true,
                    },
                });

            if (!pricing) continue;

            const optionPrice = await calculatePrice({
                printShopId,
                productTemplate: item.product_template,
                pricing: { rules: pricing.option_price_modifiers },
                document: { pages: item.document_pages },
                options: item.selected_options || {},
            });

            const unitPrice = Number(pricing.base_price) + optionPrice;
            const totalPrice = unitPrice * item.quantity;

            await strapi.db.query('api::order-item.order-item').update({
                where: { id: item.id },
                data: {
                    unit_price: unitPrice,
                    total_price: totalPrice,
                },
            });

            orderTotal += totalPrice;
        }

        /** 6️⃣ UPDATE ORDER TOTAL */
        await strapi.db.query('api::order.order').update({
            where: { id: orderId },
            data: { total_price: orderTotal },
        });

        /** 7️⃣ RESPONSE */
        const orderItemService = strapi.service('api::order-item.order-item');
        return ctx.send(await orderItemService.buildItemsByOrderResponse(order_code));
    },
};
