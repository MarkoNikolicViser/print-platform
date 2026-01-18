'use strict';

import { calculatePrice } from "../../pricing/services/pricing";

module.exports = ({ strapi }) => ({

    isOrderExpired(order) {
        if (!order) return true;
        if (order.status_code !== 'draft') return false;
        if (!order.expires_at) return false;

        return new Date(order.expires_at) < new Date();
    },

    async buildItemsByOrderResponse(order_code) {
        const order = await strapi.db.query('api::order.order').findOne({
            where: {
                order_code,
                status_code: 'draft',
            },
            populate: {
                order_items: {
                    populate: {
                        product_template: {
                            select: [
                                'id',
                                'name',
                                'description',
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
            return null;
        }

        if (this.isOrderExpired(order)) {
            return {
                expired: true,
                expiresAt: order.expires_at,
            };
        }

        const items = order.order_items || [];

        return {
            orderId: order.order_code,
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
            })),
        };
    },
    async repriceOrderItem(itemId) {
        const item = await strapi.db
            .query('api::order-item.order-item')
            .findOne({
                where: { id: itemId },
                populate: {
                    product_template: true,
                    order: {
                        populate: {
                            print_shop: true,
                        },
                    },
                },
            });

        if (!item) return;

        const pricingConfig = await strapi.db
            .query('api::print-shop-product-pricing.print-shop-product-pricing')
            .findOne({
                where: {
                    product_template: item.product_template.id,
                    print_shop: item.order.print_shop.id,
                    is_active: true,
                },
            });

        if (!pricingConfig) return;

        const unitOptionPrice = await calculatePrice({
            printShopId: item.order.print_shop.id,
            productTemplate: item.product_template,
            pricing: { rules: pricingConfig.option_price_modifiers },
            document: { pages: item.document_pages || 1 },
            options: item.selected_options,
        });

        const unitBasePrice =
            Number(pricingConfig.base_price) + unitOptionPrice;

        await strapi.db.query('api::order-item.order-item').update({
            where: { id: itemId },
            data: {
                unit_price: unitBasePrice,
                total_price: unitBasePrice * item.quantity,
            },
        });
    }

});
