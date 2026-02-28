'use strict';

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/stripe/webhook',
            handler: 'stripe.webhook',
            config: {
                auth: false, // Stripe webhook ne sme imati auth
            },
        },
        {
            method: 'POST',
            path: '/stripe/create-payment-intent',
            handler: 'stripe.createPaymentIntent',
            config: {
                auth: false
            },
        }
    ],
};