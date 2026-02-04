export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';
export const TOKEN_KEY = 'token';
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const STRAPI_REDIRECT_URI =
  process.env.NEXT_PUBLIC_STRAPI_REDIRECT_URI || 'http://localhost:1337/api/auth/google/code';
export const GOOGLE_URI = 'https://accounts.google.com/o/oauth2/v2/auth';
