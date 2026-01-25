module.exports = {
    'users-permissions': {
        config: {
            providers: {
                google: {
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callback: '/api/auth/google/callback',
                },
            },
        },
    },
};
