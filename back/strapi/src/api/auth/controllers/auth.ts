import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'http://localhost:1337/api/sso/google/callback',
});

export default {
    async googleCallback(ctx) {
        const { code } = ctx.query;

        if (!code) {
            return ctx.badRequest('Missing code');
        }

        try {
            // 1️⃣ Exchange code → tokens
            const { tokens } = await client.getToken(code as string);
            client.setCredentials(tokens);

            // 2️⃣ Verify ID token
            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token!,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload?.email) {
                return ctx.unauthorized('No email in Google payload');
            }

            const email = payload.email;

            // 3️⃣ Find or create user
            const userQuery = strapi.db.query('plugin::users-permissions.user');

            let user = await userQuery.findOne({
                where: { email },
            });

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

            // 4️⃣ Issue JWT
            const jwt = strapi
                .plugin('users-permissions')
                .service('jwt')
                .issue({ id: user.id });

            // 5️⃣ Set HttpOnly cookie (DEV SAFE)
            ctx.cookies.set('token', jwt, {
                httpOnly: false,
                secure: false,        // DEV
                sameSite: 'Lax',      // radi sa redirectom
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });

            // 6️⃣ Redirect back to frontend
            ctx.redirect(`http://localhost:3000/sso/callback?token=${jwt}`);
        } catch (err) {
            console.error('Google callback error:', err);
            ctx.redirect('http://localhost:3000/login?error=google');
        }
    },

    async logout(ctx) {
        ctx.cookies.set('token', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            path: '/',
            expires: new Date(0),
        });

        ctx.send({ ok: true });
    },
};