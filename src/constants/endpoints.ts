/// <reference types="vite/client" />

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  EVENTS: `${API_BASE_URL}/events`,
  EVENT_BY_ID: (id: string) => `${API_BASE_URL}/events/${id}`,
  EVENTS_NEARBY: `${API_BASE_URL}/events/nearby`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_SOCIAL_LOGIN: `${API_BASE_URL}/auth/social-login`,
  AUTH_GOOGLE: `${API_BASE_URL}/auth/google`,
  AUTH_FACEBOOK: `${API_BASE_URL}/auth/facebook`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,
  VERIFICATION_VERIFY: `${API_BASE_URL}/verification/verify-identity`,
} as const;
