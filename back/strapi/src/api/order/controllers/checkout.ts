'use strict';

module.exports = {
    async success(ctx) {
        const { order_code } = ctx.request.body;

        await strapi.db.query('api::order.order').update({
            where: { order_code },
            data: { status_code: 'paid' }
        });

        ctx.send({ ok: true });
    }
};
