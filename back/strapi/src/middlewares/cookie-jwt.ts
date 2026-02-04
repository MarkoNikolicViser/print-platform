export default (config, { strapi }) => {
  return async (ctx, next) => {
    const cookieName = process.env.COOKIE_NAME ?? "token";

    const existingAuth = ctx.request.headers.authorization;
    if (existingAuth) {
      return next();
    }

    const token = ctx.cookies.get(cookieName);

    if (!token) {
      return next();
    }

    ctx.request.headers.authorization = `Bearer ${token}`;

    return next();
  };
};
