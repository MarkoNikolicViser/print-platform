// src/api/auth/routes/google.ts
import { factories } from '@strapi/strapi';

export default {
    routes: [
        {
            method: 'POST',
            path: '/auth/google/code',
            handler: 'google.code',
            config: {
                auth: false,
            },
        },
    ],
};
