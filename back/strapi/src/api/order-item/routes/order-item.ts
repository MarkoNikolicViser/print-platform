'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/orders/:orderId/items/count',
            handler: 'order-item.countByOrder',
            config: {
                auth: false,
            },
        },
    ],
};
