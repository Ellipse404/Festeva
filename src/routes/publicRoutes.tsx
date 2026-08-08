import React from 'react';
import { DashboardPage } from '../pages/DashboardPage';

export interface RouteConfig {
  path: string;
  component: React.ComponentType<{ isFilterOpen: boolean }>;
}

export const publicRoutes: RouteConfig[] = [
  {
    path: 'dashboard',
    component: DashboardPage,
  },
];
