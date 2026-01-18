module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/print-shops',
            handler: 'print-shop.listShops',
            config: {
                auth: false,
            },
        },
    ],
};
