'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { v4: uuid } = require('uuid');
import { calculatePrice } from '../../pricing/services/pricing';

const isOrderExpired = (order) => {
    if (!order) return true;
    if (order.status_code !== 'draft') return false;
    if (!order.expires_at) return false;
    return new Date(order.expires_at) < new Date();
};

module.exports = createCoreController('api::order.order', ({ strapi }) => ({

    async addToCart(ctx) {
        const {
            order_code,
            product_template_id,
            selected_options,
            quantity = 1,
            print_shop_id,
            customer_email,
            customer_phone,
            document_pages = 1,
            document_url,
            document_name,
            document_mime,
        } = ctx.request.body;

        const orderItemService =
            strapi.service('api::order-item.order-item');

        let order = null;

        // 1️⃣ Existing order
        if (order_code) {
            const existingOrder = await strapi.db
                .query('api::order.order')
                .findOne({
                    where: { order_code },
                    populate: ['order_items'],
                });

            if (existingOrder && !orderItemService.isOrderExpired(existingOrder)) {
                order = existingOrder;
            }
        }

        // 2️⃣ Create order if needed
        if (!order) {
            order = await strapi.db.query('api::order.order').create({
                data: {
                    order_code: uuid(),
                    status_code: 'draft',
                    total_price: 0,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    print_shop: print_shop_id,
                    customer_email,
                    customer_phone,
                },
            });
        }

        // 3️⃣ Parse options
        let parsedOptions = {};
        if (selected_options) {
            try {
                parsedOptions =
                    typeof selected_options === 'string'
                        ? JSON.parse(selected_options)
                        : selected_options;
            } catch {
                return ctx.badRequest('selected_options must be valid JSON');
            }
        }

        const qty = Number(quantity) || 1;
        const pages = Number(document_pages) || 1;

        // 4️⃣ Fetch product template + pricing
        const productTemplate = await strapi.db
            .query('api::product-template.product-template')
            .findOne({ where: { id: product_template_id } });

        if (!productTemplate) {
            return ctx.badRequest('Product template not found');
        }

        const pricingConfig = await strapi.db
            .query('api::print-shop-product-pricing.print-shop-product-pricing')
            .findOne({
                where: {
                    print_shop: print_shop_id,
                    product_template: product_template_id,
                    is_active: true,
                },
            });

        if (!pricingConfig?.option_price_modifiers) {
            return ctx.badRequest('Pricing not configured for this product');
        }

        // 5️⃣ Calculate unit price = base_price + options
        const optionPrice = await calculatePrice({
            printShopId: print_shop_id,
            productTemplate,
            pricing: { rules: pricingConfig.option_price_modifiers },
            document: { pages },
            options: parsedOptions,
        });

        const unitPrice = Number(pricingConfig.base_price) + optionPrice;
        const totalItemPrice = unitPrice * qty;

        // 6️⃣ Create order item
        await strapi.db.query('api::order-item.order-item').create({
            data: {
                order: order.id,
                product_template: product_template_id,
                selected_options: parsedOptions,
                quantity: qty,
                document_url,
                document_name,
                document_pages: pages,
                document_mime,
                unit_price: unitPrice,
                total_price: totalItemPrice,
            },
        });

        // 7️⃣ Reprice all items in order to ensure totals are correct
        const allItems = await strapi.db
            .query('api::order-item.order-item')
            .findMany({
                where: { order: order.id },
                populate: { product_template: true },
            });

        let orderTotal = 0;

        for (const item of allItems) {
            const itemOptionPrice = await calculatePrice({
                printShopId: print_shop_id,
                productTemplate: item.product_template,
                pricing: { rules: pricingConfig.option_price_modifiers },
                document: { pages: item.document_pages },
                options: item.selected_options,
            });

            const itemUnitPrice = Number(pricingConfig.base_price) + itemOptionPrice;
            const itemTotal = itemUnitPrice * item.quantity;

            await strapi.db.query('api::order-item.order-item').update({
                where: { id: item.id },
                data: {
                    unit_price: itemUnitPrice,
                    total_price: itemTotal,
                },
            });

            orderTotal += itemTotal;
        }

        // 8️⃣ Update order total
        await strapi.db.query('api::order.order').update({
            where: { id: order.id },
            data: { total_price: orderTotal },
        });

        // 9️⃣ Build response like sync / itemsByOrder
        const response = await orderItemService.buildItemsByOrderResponse(
            order.order_code
        );

        if (response?.expired) {
            ctx.status = 410;
            return ctx.send({
                message: 'Order has expired',
                expired: true,
                expiresAt: response.expiresAt,
            });
        }

        return ctx.send(response);
    },
    async accept(ctx) {
        const { orderId } = ctx.params;
        const { estimated_minutes } = ctx.request.body;

        if (!estimated_minutes || estimated_minutes <= 0) {
            return ctx.badRequest('Estimated minutes required');
        }

        const now = new Date();
        const estimatedCompletion = new Date(
            now.getTime() + estimated_minutes * 60 * 1000
        );

        const order = await strapi.db.query('api::order.order').update({
            where: { id: orderId },
            data: {
                status_code: 'accepted',
                estimated_completion_at: estimatedCompletion
            }
        });

        ctx.send({ order });
    },

    async markReady(ctx) {
        const { orderId } = ctx.params;

        const order = await strapi.db.query('api::order.order').findOne({
            where: { id: orderId },
            populate: ['print_shop']
        });

        if (!order || !order.estimated_completion_at) {
            return ctx.badRequest('Order not ready for completion');
        }

        const completedAt = new Date();
        const completedOnTime =
            completedAt <= new Date(order.estimated_completion_at);

        // 1️⃣ Update order
        await strapi.db.query('api::order.order').update({
            where: { id: orderId },
            data: {
                status_code: 'ready',
                completed_at: completedAt,
                completed_on_time: completedOnTime
            }
        });

        // 2️⃣ Update print shop statistike
        const shop = order.print_shop;

        const total = shop.total_completed_orders + 1;
        const onTime = completedOnTime ? 1 : 0;

        const newRate =
            (shop.on_time_rate * shop.total_completed_orders + onTime) / total;

        await strapi.db.query('api::print-shop.print-shop').update({
            where: { id: shop.id },
            data: {
                total_completed_orders: total,
                on_time_rate: Number(newRate.toFixed(2))
            }
        });

        ctx.send({ completedOnTime });
    }

}));
