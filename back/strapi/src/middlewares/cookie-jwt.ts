export default (config, { strapi }) => {
    return async (ctx, next) => {
        const token = ctx.cookies.get('token', { signed: true });
        if (token && !ctx.request.headers.authorization) {
            ctx.request.headers.authorization = `Bearer ${token}`;
        }

        await next();
    };
};