module.exports = {
    routes: [
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
