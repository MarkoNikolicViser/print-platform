'use strict';

module.exports = {
    async countByOrder(ctx) {
        const { orderId } = ctx.params;

        if (!orderId) {
            return ctx.badRequest('orderId is required');
        }

        const order = await strapi.db.query('api::order.order').findOne({
            where: { order_code: orderId, status_code: 'draft' },
            populate: { order_items: true }, // ✅ populate relation
        });

        if (!order) {
            return ctx.notFound('Order not found');
        }

        const count = order.order_items?.length || 0;

        ctx.send({ orderId, count });
    },
};