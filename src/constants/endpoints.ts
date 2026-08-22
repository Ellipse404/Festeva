/// <reference types="vite/client" />

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    SOCIAL_LOGIN: '/auth/social-login',
    GOOGLE: '/auth/google',
    FACEBOOK: '/auth/facebook',
    ME: '/auth/me',
  },
  EVENTS: {
    BASE: '/events',
    BY_ID: (id: string) => `/events/${id}`,
    NEARBY: '/events/nearby',
  },
  VERIFICATION: {
    VERIFY: '/verification/verify-identity',
  },
} as const;
