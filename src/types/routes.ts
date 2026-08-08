import React from 'react';

export interface RouteConfig {
  path: string;
  component: React.ComponentType<{ isFilterOpen: boolean }>;
}

export interface PrivateRouteConfig {
  path: string;
  component: React.ComponentType<any>;
  requiresAuth: boolean;
}
