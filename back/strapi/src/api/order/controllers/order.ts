'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { v4: uuidv4 } = require('uuid');

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
            document_s3_key,
            file_name,
            copies,
            color,
            binding,
            pages,
            price,
            customer_email,
            customer_phone,
            print_shop_id
        } = ctx.request.body;

        if (!document_s3_key || !copies || !color || !binding || !price) {
            return ctx.badRequest('Missing required fields');
        }

        let order = null;
        const now = new Date();

        // 1️⃣ Try to load existing draft order by order_code
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

        // 2️⃣ Create new order if none exists or expired
        if (!order) {
            order = await strapi.db.query('api::order.order').create({
                data: {
                    order_code: uuidv4(),
                    status_code: 'draft',
                    total_price: 0,
                    customer_email,
                    customer_phone,
                    print_shop_id,
                    expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000) // +24h
                }
            });
        }

        // 3️⃣ Create order item
        await strapi.db.query('api::order-item.order-item').create({
            data: {
                order: order.id,
                document_s3_key,
                file_name,
                copies,
                color,
                binding,
                pages,
                price
            }
        });

        // 4️⃣ Recalculate total price
        const items = await strapi.db
            .query('api::order-item.order-item')
            .findMany({
                where: { order: order.id }
            });

        const total = items.reduce(
            (sum, item) => sum + Number(item.price),
            0
        );

        await strapi.db.query('api::order.order').update({
            where: { id: order.id },
            data: { total_price: total }
        });

        // 5️⃣ Return updated cart
        const populatedOrder = await strapi.db
            .query('api::order.order')
            .findOne({
                where: { id: order.id },
                populate: ['order_items']
            });

        ctx.send({
            order_code: populatedOrder.order_code,
            order: populatedOrder
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
