import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/auth/callback',
});

export default {
    async code(ctx) {
        const { code } = ctx.request.body;
        if (!code) return ctx.badRequest('Missing code');

        try {
            // Samo prosledi code
            const { tokens } = await client.getToken(code);
            client.setCredentials(tokens);

            // Verifikacija id_token
            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token!,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload?.email) return ctx.unauthorized('No email in payload');
            const email = payload.email;

            // find/create user
            const userQuery = strapi.db.query('plugin::users-permissions.user');
            let user = await userQuery.findOne({ where: { email } });
            if (!user) {
                user = await strapi
                    .plugin('users-permissions')
                    .service('user')
                    .add({
                        username: email,
                        email,
                        provider: 'google',
                        confirmed: true,
                    });
            }

            // JWT
            const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });

            // postavi cookie
            ctx.cookies.set('token', jwt, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });

            ctx.body = { success: true };
        } catch (err) {
            console.error(err);
            return ctx.badRequest('Google OAuth failed');
        }
    },
};
