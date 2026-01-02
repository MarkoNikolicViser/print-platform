module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/orders/add-to-cart',
            handler: 'order.addToCart',
            config: {
                auth: false
            }
        }
    ]
};
