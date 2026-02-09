'use strict';

import Pusher = require("pusher");

module.exports = {
    async success(ctx) {
        const {
            order_code,
            customer_email,
            provider = 'PayPal',
            provider_payment_id,
            amount,
            fee = 0,
        } = ctx.request.body;

        if (!order_code || !provider_payment_id || !amount) {
            return ctx.badRequest('Missing required fields');
        }

        const order = await strapi.db.query('api::order.order').findOne({
            where: { order_code },
            populate: ['print_shop_id'],
        });

        if (!order) return ctx.notFound('Order not found');
        if (order.status_code === 'paid') {
            return ctx.send({ ok: true });
        }

        // update order
        const updatedOrder = await strapi.db.query('api::order.order').update({
            where: { id: order.id },
            data: {
                status_code: 'paid',
                customer_email,
            },
        });

        // create payment
        await strapi.db.query('api::payment.payment').create({
            data: {
                provider,
                provider_payment_id,
                amount,
                fee,
                status_code: 'paid',
                order_id: updatedOrder.id,
            },
        });
        const pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_KEY,
            secret: process.env.PUSHER_SECRET,
            cluster: process.env.PUSHER_CLUSTER,
            useTLS: true,
        });
        // 🔔 PUSHER NOTIFICATION
        if (order.print_shop_id?.id) {
            await pusher.trigger(
                `print-shop-${order.print_shop_id.id}`,
                'new-order',
                {
                    orderId: updatedOrder.id,
                    orderCode: order.order_code,
                    total: order.total_price,
                }
            );
        }

        ctx.send({ ok: true });
    },
};
