declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_STRAPI_URL?: string;
    NEXT_PUBLIC_STRAPI_API_URL?: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
    NEXT_PUBLIC_GOOGLE_URI?: string;
    NEXT_PUBLIC_STRAPI_REDIRECT_URI?: string;
    NEXT_PUBLIC_GEOAPIFY_KEY?: string;
    NEXT_PUBLIC_PUSHER_KEY?: string;
    NEXT_PUBLIC_PUSHER_CLUSTER?: string;
  }
}
