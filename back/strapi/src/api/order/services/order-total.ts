'use strict';

module.exports = ({ strapi }) => ({
    async recalc(orderId) {
        const items = await strapi.db
            .query('api::order-item.order-item')
            .findMany({ where: { order: orderId } });

        const total = items.reduce(
            (sum, i) => sum + Number(i.total_price),
            0
        );

        await strapi.db.query('api::order.order').update({
            where: { id: orderId },
            data: { total_price: total }
        });
    }
});
