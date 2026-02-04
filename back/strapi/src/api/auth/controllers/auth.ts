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

    ctx.cookies.set("token", jwt, {
      httpOnly: true,
      secure: false, // DEV
      sameSite: "Lax",
      path: "/",
      maxAge: 31536000,
    });

    ctx.send({ user });
  },
  async register(ctx) {
    const { username, email, password } = ctx.request.body;

    if (!username || !email || !password) {
      return ctx.badRequest("Missing required fields");
    }

    const userQuery = strapi.query("plugin::users-permissions.user");

    // 1️⃣ Proveri da li user već postoji
    const existingUser = await userQuery.findOne({
      where: { email },
    });

    if (existingUser) {
      return ctx.badRequest("Email already in use");
    }

    // 2️⃣ Uzmi authenticated role
    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "authenticated" } });

    // 3️⃣ Kreiraj usera
    const user = await strapi.plugin("users-permissions").service("user").add({
      username,
      email,
      password,
      confirmed: true, // ako nemaš email confirmation
      provider: "local",
      role: role.id,
    });

    // 4️⃣ Izdaj JWT
    const jwt = strapi
      .plugin("users-permissions")
      .service("jwt")
      .issue({ id: user.id });

    // 5️⃣ Setuj httpOnly cookie
    ctx.cookies.set("token", jwt, {
      httpOnly: true,
      secure: true, // DEV → true u produkciji
      sameSite: "Lax",
      path: "/",
      maxAge: 31536000,
    });

    // 6️⃣ Vrati usera (bez jwt-a)
    ctx.send({ user });
  },
  async googleCallback(ctx) {
    const { code } = ctx.query;

    if (!code) {
      return ctx.badRequest("Missing code");
    }

    try {
      // 1️⃣ Exchange code → tokens
      const { tokens } = await client.getToken(code as string);
      client.setCredentials(tokens);

      // 2️⃣ Verify ID token
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload?.email) {
        return ctx.unauthorized("No email in Google payload");
      }

      const email = payload.email;

      // 3️⃣ Find or create user
      const userQuery = strapi.db.query("plugin::users-permissions.user");

      let user = await userQuery.findOne({
        where: { email },
      });

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

      ctx.cookies.set("token", jwt, {
        httpOnly: true,
        secure: false, // DEV → true u produkciji
        sameSite: "Lax", // OK za localhost
        path: "/",
        maxAge: 31536000, // 365 dana
      });

      ctx.redirect(`${FRONTEND_URL}/store`);
    } catch (err) {
      console.error("Google callback error:", err);
      ctx.redirect(`${FRONTEND_URL}/login?error=google`);
    }
  },

  async logout(ctx) {
    ctx.cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      expires: new Date(0),
    });

    ctx.send({ ok: true });
  },
};
