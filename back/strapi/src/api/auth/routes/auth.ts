// src/api/auth/routes/auth.ts
export default {
    routes: [
        {
            method: 'POST',
            path: '/auth/local-cookie',
            handler: 'auth.login',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/auth/register-cookie',
            handler: 'auth.register',
            config: {
                auth: false
            },
        },
        {
            method: 'GET',
            path: '/sso/google/callback',
            handler: 'auth.googleCallback',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/auth/logout',
            handler: 'auth.logout',
            config: {
                auth: false,
            },
        },
    ],
};