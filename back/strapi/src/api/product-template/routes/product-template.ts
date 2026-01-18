'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/product-templates/by-mime',
            handler: 'product-template.findByMime',
            auth: false,
        },
    ],
};
