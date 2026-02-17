module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/print-shops',
            handler: 'print-shop.listShops',
            config: {
                auth: { required: false },
            },
        },
        {
            method: 'GET',
            path: '/print-shop/me',
            handler: 'print-shop.me',
            config: {
                auth: { required: true },
                policies: ['api::print-shop.is-shop-owner'],
            },
        },
        {
            method: 'PUT',
            path: '/print-shop/me',
            handler: 'print-shop.updateMe',
            config: {
                auth: { required: true },
                policies: ['api::print-shop.is-shop-owner'],
            },
        },
        {
            method: 'POST',
            path: '/print-shop/create',
            handler: 'print-shop.createMe',
            config: {
                auth: { required: true }
            },
        },
    ],
};