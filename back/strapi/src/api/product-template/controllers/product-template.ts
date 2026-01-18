'use strict';

module.exports = {
    async findByMime(ctx) {
        const { document_mime } = ctx.query;

        if (!document_mime) {
            return ctx.badRequest('document_mime is required');
        }

        const templates = await strapi.entityService.findMany(
            'api::product-template.product-template',
            {
                filters: {
                    supported_mime: {
                        $contains: [document_mime],
                    },
                },
                fields: ['id', 'name', 'description', 'icon', 'allowed_options'],
            }
        );

        ctx.send({ data: templates });
    },
};
