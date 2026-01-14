'use strict';

module.exports = {
    async countByOrder(ctx) {
        const { orderId } = ctx.params;

        if (!orderId) {
            return ctx.badRequest('orderId is required');
        }

        const count = await strapi.db
            .query('api::order-item.order-item')
            .count({
                where: {
                    order: {
                        id: orderId,
                        status_code: 'draft',
                    },
                },
            });

        ctx.send({
            orderId: Number(orderId),
            count,
        });
    },
};
