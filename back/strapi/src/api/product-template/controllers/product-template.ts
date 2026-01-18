'use strict';

module.exports = {
    async findByMime(ctx) {

        const { document_mime } = ctx.query;

        if (!document_mime || typeof document_mime !== 'string') {
            return ctx.badRequest('document_mime is required and must be string');
        }

        const templates = await strapi.entityService.findMany(
            'api::product-template.product-template',
            {
                filters: {
                    supported_mime: {
                        $contains: [document_mime] as any,
                    },
                },
                fields: ['id', 'name', 'description', 'icon', 'allowed_options'],
            }
        );

        ctx.send({ data: templates });
    },
};
