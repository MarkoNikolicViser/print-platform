'use strict';
export default ({ strapi }: { strapi: any }) => ({

    isOrderExpired(order) {
        if (!order) return true;
        if (order.status_code !== 'draft') return false;
        if (!order.expires_at) return false;

        return new Date(order.expires_at) < new Date();
    }

});
