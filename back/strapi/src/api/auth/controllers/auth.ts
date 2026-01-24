'use strict';

module.exports = {
    async logout(ctx) {
        ctx.cookies.set('jwtToken', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });

        if (ctx.session) {
            ctx.session = null;
        }

        ctx.send({
            ok: true,
            message: 'Logged out successfully',
        });
    },
};
