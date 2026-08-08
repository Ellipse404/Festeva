import React from 'react';
import { HostEventPage } from '../pages/HostEventPage';
import { AttendEventPage } from '../pages/AttendEventPage';
import { SettingsPage } from '../pages/SettingsPage';

export interface PrivateRouteConfig {
  path: string;
  component: React.ComponentType<any>;
  requiresAuth: boolean;
}

export const privateRoutes: PrivateRouteConfig[] = [
  {
    path: 'host',
    component: HostEventPage,
    requiresAuth: true,
  },
  {
    path: 'attend',
    component: AttendEventPage,
    requiresAuth: true,
  },
  {
    path: 'settings',
    component: SettingsPage,
    requiresAuth: true,
  },
];
