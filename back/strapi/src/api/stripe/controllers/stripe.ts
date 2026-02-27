'use strict';

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
    async createPaymentIntent(ctx) {
        const { order_code } = ctx.request.body;

        if (!order_code) {
            return ctx.badRequest('Missing order_code');
        }

        const order = await strapi.db.query('api::order.order').findOne({
            where: { order_code },
        });

        if (!order) return ctx.notFound('Order not found');
        if (order.status_code === 'paid') {
            return ctx.badRequest('Order already paid');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.total_price) * 100),
            currency: 'rsd',
            metadata: {
                order_code: order.order_code,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        ctx.send({
            clientSecret: paymentIntent.client_secret,
        });
    },
    async webhook(ctx) {
        const sig = ctx.request.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                ctx.request.body[Symbol.for('unparsedBody')],
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log('Webhook signature failed:', err.message);
            return ctx.badRequest(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;

            const order_code = paymentIntent.metadata.order_code;

            const order = await strapi.db.query('api::order.order').findOne({
                where: { order_code },
                populate: ['print_shop_id'],
            });

            if (!order) {
                return ctx.send({ received: true });
            }

            if (order.status_code !== 'paid') {

                const updatedOrder = await strapi.db.query('api::order.order').update({
                    where: { id: order.id },
                    data: {
                        status_code: 'paid',
                    },
                });

                await strapi.db.query('api::payment.payment').create({
                    data: {
                        provider: 'Stripe',
                        provider_payment_id: paymentIntent.id, // ✅
                        amount: paymentIntent.amount_received / 100, // ✅
                        fee: 0,
                        status_code: 'paid',
                        order_id: updatedOrder.id,
                    },
                });

                console.log('Order marked as paid:', order_code);
            }
        }

        ctx.send({ received: true });
    },
};