/// <reference types="vite/client" />

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  EVENTS: `${API_BASE_URL}/events`,
  EVENT_BY_ID: (id: string) => `${API_BASE_URL}/events/${id}`,
  EVENTS_NEARBY: `${API_BASE_URL}/events/nearby`,
} as const;
