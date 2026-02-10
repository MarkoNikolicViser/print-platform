'use strict';

import Pusher from 'pusher';

module.exports = {
    async auth(ctx) {
        // ctx.state.printShopId je postavljen kroz tvoj policy (iz cookie/JWT)
        const printShopId = ctx.state.printShopId;

        if (!printShopId) {
            return ctx.unauthorized('No print shop associated with user');
        }

        const { socket_id, channel_name } = ctx.request.body;

        // frontend ne šalje printShopId, backend ga zna iz JWT-a
        if (channel_name !== `private-print-shop-${printShopId}`) {
            return ctx.unauthorized('Invalid channel');
        }

        const pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_KEY,
            secret: process.env.PUSHER_SECRET,
            cluster: process.env.PUSHER_CLUSTER,
            useTLS: true,
        });

        const auth = pusher.authenticate(socket_id, channel_name);
        ctx.send(auth);
    },
};
