export default ({ env }) => ({
    'users-permissions': {
        config: {
            providers: {
                google: {
                    clientId: env('GOOGLE_CLIENT_ID'),
                    clientSecret: env('GOOGLE_CLIENT_SECRET'),
                    callback: 'http://localhost:3000/auth/callback',
                },
            },
            jwt: {
                expiresIn: '7d',
            },
            cookie: {
                name: 'token',
            },
        },
    },
});
