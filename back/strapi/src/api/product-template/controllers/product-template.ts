'use strict';

module.exports = {
    async findByMime(ctx) {
        const { document_mime } = ctx.request.body;

        if (!document_mime) {
            return ctx.badRequest('document_mime is required');
        }

        const templates = await strapi.db
            .query('api::product-template.product-template')
            .findMany({
                where: {
                    supported_mime: {
                        $contains: document_mime,
                    },
                },
                select: ['id', 'name', 'description', 'icon'],
            });

        ctx.send(templates);
    },
};
