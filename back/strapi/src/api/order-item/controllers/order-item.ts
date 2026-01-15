'use strict';

module.exports = {
    async countByOrder(ctx) {
        const { orderId } = ctx.params;

        if (!orderId) {
            return ctx.badRequest('orderId is required');
        }

        const order = await strapi.db.query('api::order.order').findOne({
            where: { order_code: orderId, status_code: 'draft' },
            populate: { order_items: true },
        });

        if (!order) {
            return ctx.notFound('Order not found');
        }

        const { isOrderExpired } = strapi.service('api::order-item.order-item');

        if (isOrderExpired(order)) {
            ctx.status = 410;
            return ctx.send({
                message: 'Order has expired',
                expired: true,
            });
        }

        const count = order.order_items?.length || 0;

        ctx.send({ orderId, count });
    },

    async itemsByOrder(ctx) {
        const { orderId } = ctx.params;

        if (!orderId) {
            return ctx.badRequest('orderId is required');
        }

        const order = await strapi.db.query('api::order.order').findOne({
            where: {
                order_code: orderId,
                status_code: 'draft',
            },
            populate: {
                order_items: {
                    populate: {
                        product_template: {
                            select: [
                                'id',
                                'name',
                                'icon',
                                'allowed_options',
                                'supported_mime',
                            ],
                        },
                    },
                },
            },
        });

        if (!order) {
            return ctx.notFound('Order not found');
        }

        const { isOrderExpired } = strapi.service('api::order-item.order-item');

        if (isOrderExpired(order)) {
            ctx.status = 410;
            return ctx.send({
                message: 'Order has expired',
                expired: true,
            });
        }

        const items = order.order_items || [];

        return ctx.send({
            orderId,
            count: items.length,
            total: order.total_price,
            expiresAt: order.expires_at,
            items: items.map(item => ({
                id: item.id,
                documentId: item.documentId,
                selected_options: item.selected_options,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
                document_url: item.document_url,
                document_name: item.document_name,
                document_pages: item.document_pages,
                document_mime: item.document_mime,
                status_code: item.status_code,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                allowed_options: item.product_template?.allowed_options || {},
                product_template: item.product_template && {
                    id: item.product_template.id,
                    name: item.product_template.name,
                    description: item.product_template.description,
                    icon: item.product_template.icon,
                    supported_mime: item.product_template.supported_mime,
                    allowed_options: item.product_template.allowed_options,
                },
            }))
        }
        );
    },
};
