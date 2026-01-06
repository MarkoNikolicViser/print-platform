module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/orders/add-to-cart',
            handler: 'order.addToCart',
            config: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/orders/:orderId/accept',
            handler: 'order.accept'
        },
        {
            method: 'POST',
            path: '/orders/:orderId/ready',
            handler: 'order.markReady'
        }
    ]
};
