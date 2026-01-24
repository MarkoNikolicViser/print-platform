'use strict';

module.exports = (plugin) => {
    const originalGoogleCallback =
        plugin.controllers.auth.connect; // ovo je Google /connect callback

    plugin.controllers.auth.connect = async (ctx) => {
        const provider = ctx.params.provider;

        if (provider !== 'google') {
            // ako nije Google, koristi original
            return originalGoogleCallback(ctx);
        }

        // pozovi originalni Google connect
        await originalGoogleCallback(ctx);

        const { user, jwt } = ctx.body || {};
        if (!user || !jwt) return;

        try {
            // proveri da li već postoji user u users-permissions tabeli
            const existing = await strapi
                .query('plugin::users-permissions.user')
                .findOne({ where: { email: user.email } });

            if (!existing) {
                // kreiraj usera u users-permissions
                const newUser = await strapi
                    .query('plugin::users-permissions.user')
                    .create({
                        data: {
                            username: user.username || user.email,
                            email: user.email,
                            provider: 'google',
                            confirmed: true,
                        },
                    });

                // update body da frontend dobije pravi user id
                ctx.body.user = newUser;
            }
        } catch (err) {
            strapi.log.error('SSO User creation failed:', err);
        }
    };

    return plugin;
};
