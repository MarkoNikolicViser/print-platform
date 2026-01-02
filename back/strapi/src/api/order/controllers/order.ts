'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { v4: uuidv4 } = require('uuid');

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

        let order;

        // 1️⃣ Try to load existing draft order
        if (order_code) {
            order = await strapi.db.query('api::order.order').findOne({
                where: {
                    order_code,
                    status_code: 'draft'
                },
                populate: ['order_items']
            });
        }

        // 2️⃣ Create new order if not found
        if (!order) {
            order = await strapi.db.query('api::order.order').create({
                data: {
                    order_code: uuidv4(),
                    status_code: 'draft',
                    total_price: 0,
                    customer_email,
                    customer_phone,
                    print_shop_id
                }
            });
        }

        // 3️⃣ Create order item
        const orderItem = await strapi.db
            .query('api::order-item.order-item')
            .create({
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
    }

}));
