export default {
    routes: [
        {
            method: 'POST',
            path: '/pricing/upsert',
            handler: 'print-shop-product-pricing.upsert',
            config: {
                auth: { required: true },
                policies: ['api::print-shop.is-shop-owner'],
            },
        },
    ],
};