export default (config, { strapi }) => {
  return async (ctx, next) => {
    const cookieName = process.env.COOKIE_NAME || "token";

    // If you use signed cookies, keep this:
    // const token = ctx.cookies.get(cookieName, { signed: true });

    // If you DON'T need signed cookies (JWT already signed), prefer this:
    const token = ctx.cookies.get(cookieName);

    const hadAuth = !!ctx.request.headers.authorization;

    if (token && !hadAuth) {
      ctx.request.headers.authorization = `Bearer ${token}`;
    }

    // ✅ Debug (safe): don't print full token
    const tokenPreview = token
      ? `${token.slice(0, 12)}...${token.slice(-8)}`
      : null;

    strapi.log.info(
      `[cookie-jwt] ${ctx.method} ${ctx.url} ` +
        `cookie:${!!token} authBefore:${hadAuth} authAfter:${!!ctx.request.headers.authorization} ` +
        `tokenPreview:${tokenPreview}`
    );

    await next();
  };
};
