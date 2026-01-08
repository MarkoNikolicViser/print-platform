'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { v4: uuid } = require('uuid');

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
            quantity,
            print_shop_id,
            customer_email,
            customer_phone,
            document_pages,
            document_url,
            document_name,
            document_mime
        } = ctx.request.body;

        let order = null;

        if (order_code) {
            const existingOrder = await strapi.db
                .query('api::order.order')
                .findOne({
                    where: { order_code },
                    populate: ['order_items']
                });
            if (existingOrder && !isOrderExpired(existingOrder)) {
                order = existingOrder;
            }
        }

        if (!order) {
            order = await strapi.db.query('api::order.order').create({
                data: {
                    order_code: uuid(),
                    status_code: 'draft',
                    total_price: 0,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    print_shop: print_shop_id,
                    customer_email,
                    customer_phone
                }
            });
        }

        const pricing = await strapi
            .service('api::order.pricing')
            .calculate({
                productTemplateId: product_template_id,
                printShopId: print_shop_id,
                selectedOptions: selected_options,
                quantity,
                numberOfPages: document_pages
            });
        await strapi.db.query('api::order-item.order-item').create({
            data: {
                order: order.id,
                product_template: product_template_id,
                selected_options,
                quantity,
                document_url,
                document_name,
                document_pages,
                document_mime,
                ...pricing
            }
        });

        await strapi.service('api::order.order-total').recalc(order.id);

        ctx.send({
            order_code: order.order_code
        });
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
            populate: ['print_shop_id']
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

        // 2️⃣ Update print shop stats
        const shop = order.print_shop_id;

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
