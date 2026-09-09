import React from 'react';
import { LoginPage } from '../pages/LoginPage';

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
}

export const publicRoutes: RouteConfig[] = [
  {
    path: 'login',
    component: LoginPage,
  },
];
