'use strict';

module.exports = {
    async list(ctx) {
        const shopId = ctx.state.user.print_shop;

        const orders = await strapi.db
            .query('api::order.order')
            .findMany({
                where: { print_shop: shopId, status_code: { $ne: 'draft' } },
                populate: { order_items: true }
            });

        ctx.send(orders);
    },

    async updateItem(ctx) {
        const { itemId, status } = ctx.request.body;

        await strapi.db.query('api::order-item.order-item').update({
            where: { id: itemId },
            data: {
                status_code: status,
                completed_at: status === 'ready' ? new Date() : null
            }
        });

        ctx.send({ ok: true });
    }
};
