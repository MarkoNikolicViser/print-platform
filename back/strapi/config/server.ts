export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  url: env('PUBLIC_URL', 'http://localhost:1337'),

  frontendUrl: env('FRONTEND_URL', 'http://localhost:3000'),

  app: {
    keys: env.array('APP_KEYS'),
  },
  jwtSecret: env('JWT_SECRET', 'your-super-secret-key'),
});
