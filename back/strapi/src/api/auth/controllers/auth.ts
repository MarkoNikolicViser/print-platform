import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const CALLBACK_URI =
  process.env.CALLBACK_URI || "http://localhost:1337/api/sso/google/callback";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: CALLBACK_URI,
});

// ---- Cookie helpers (env-driven) ----
const isProd = process.env.NODE_ENV === "production";

/**
 * Env vars supported:
 * - COOKIE_NAME (default: token)
 * - COOKIE_DOMAIN (optional; e.g. ".example.com")
 * - COOKIE_SECURE ("true"/"false") default: true in prod, false in dev
 * - COOKIE_SAMESITE ("lax"/"none"/"strict") default: none in prod, lax in dev
 * - COOKIE_MAX_AGE_DAYS (default: 365)
 */
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

function parseBool(value, fallback) {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

function cookieOptions() {
  const days = Number(process.env.COOKIE_MAX_AGE_DAYS || 365);
  const maxAge = 1000 * 60 * 60 * 24 * days; // ✅ milliseconds (Koa expects ms)

  const sameSite = (
    process.env.COOKIE_SAMESITE || (isProd ? "none" : "lax")
  ).toLowerCase();

  const secure = parseBool(process.env.COOKIE_SECURE, isProd);

  // If SameSite=None, Secure MUST be true (browsers will block otherwise)
  const finalSecure = sameSite === "none" ? true : secure;

  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure: finalSecure,
    sameSite: sameSite, // "lax" | "none" | "strict"
    path: "/",
    maxAge,
    ...(domain ? { domain } : {}),
  };
}

function clearCookieOptions() {
  // Use same flags as set-cookie so removal works reliably
  return {
    ...cookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  };
}

export default {
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest("Missing credentials");
    }

    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: {
        $or: [{ email: identifier }, { username: identifier }],
      },
      populate: ["role"],
    });

    if (!user || !user.password) {
      return ctx.unauthorized("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return ctx.unauthorized("Invalid credentials");
    }

    if (!user.confirmed) {
      return ctx.unauthorized("Account not confirmed");
    }

    const jwt = strapi
      .plugin("users-permissions")
      .service("jwt")
      .issue({ id: user.id });

    ctx.cookies.set(COOKIE_NAME, jwt, cookieOptions());
    ctx.send({ user });
  },

  async register(ctx) {
    const { username, email, password } = ctx.request.body;

    if (!username || !email || !password) {
      return ctx.badRequest("Missing required fields");
    }

    const userQuery = strapi.query("plugin::users-permissions.user");

    const existingUser = await userQuery.findOne({ where: { email } });
    if (existingUser) {
      return ctx.badRequest("Email already in use");
    }

    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "authenticated" } });

    const user = await strapi.plugin("users-permissions").service("user").add({
      username,
      email,
      password,
      confirmed: true,
      provider: "local",
      role: role.id,
    });

    const jwt = strapi
      .plugin("users-permissions")
      .service("jwt")
      .issue({ id: user.id });

    ctx.cookies.set(COOKIE_NAME, jwt, cookieOptions());
    ctx.send({ user });
  },

  async googleCallback(ctx) {
    const { code } = ctx.query;

    if (!code) {
      return ctx.badRequest("Missing code");
    }

    try {
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload?.email) {
        return ctx.unauthorized("No email in Google payload");
      }

      const email = payload.email;

      const userQuery = strapi.db.query("plugin::users-permissions.user");
      let user = await userQuery.findOne({ where: { email } });

      const role = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "authenticated" } });

      if (!user) {
        user = await strapi.plugin("users-permissions").service("user").add({
          username: email,
          email,
          provider: "google",
          confirmed: true,
          role: role.id,
        });
      }

      const jwt = strapi
        .plugin("users-permissions")
        .service("jwt")
        .issue({ id: user.id });

      ctx.cookies.set(COOKIE_NAME, jwt, cookieOptions());
      ctx.redirect(`${FRONTEND_URL}/store`);
    } catch (err) {
      console.error("Google callback error:", err);
      ctx.redirect(`${FRONTEND_URL}/login?error=google`);
    }
  },

  async logout(ctx) {
    ctx.cookies.set(COOKIE_NAME, "", clearCookieOptions());
    ctx.send({ ok: true });
  },
};
