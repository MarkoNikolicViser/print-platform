'use strict';

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/product-templates/by-mime',
            handler: 'product-template.findByMime',
            auth: false,
        },
    ],
};
