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
        },
        {
            method: 'POST',
            path: '/checkout/success',
            handler: 'checkout.success'
        },
        {
            method: 'GET',
            path: '/shop-panel/orders',
            handler: 'shop-panel.list'
        },
        {
            method: 'POST',
            path: '/shop-panel/order-item',
            handler: 'shop-panel.updateItem'
        }
    ]
};
