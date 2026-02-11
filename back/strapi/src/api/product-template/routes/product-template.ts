'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/product-templates/by-mime',
            handler: 'product-template.findByMime',
            auth: false,
        },
        {
            method: 'GET',
            path: '/product-templates',
            handler: 'product-template.findAll',
            config: {
                auth: { required: true },
                policies: ['api::print-shop.is-shop-owner'],
            },
        },
    ],
};
