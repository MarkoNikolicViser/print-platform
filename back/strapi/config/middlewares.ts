export default [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      enableTypes: ['json', 'form', 'text'],
      credentials: true,
    },
  },
  {
    name: 'global::cookie-jwt',
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '10mb',
      formLimit: '10mb',
      textLimit: '10mb',
      includeUnparsed: true, // 👈 KLJUČNO ZA STRIPE
    },
  }, 'strapi::session',
  'strapi::favicon',
  'strapi::public',
];