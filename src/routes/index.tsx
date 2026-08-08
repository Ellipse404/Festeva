import React from 'react';
import { useApp } from '../hooks/useApp';
import { publicRoutes } from './publicRoutes';
import { privateRoutes } from './privateRoutes';
import { DashboardPage } from '../pages/DashboardPage';
import { HostEventPage } from '../pages/HostEventPage';
import { AttendEventPage } from '../pages/AttendEventPage';
import { SettingsPage } from '../pages/SettingsPage';

interface AppRoutesProps {
  isFilterOpen: boolean;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ isFilterOpen }) => {
  const { activeNav } = useApp();

  // Match route by activeNav state
  if (activeNav === 'host') {
    return <HostEventPage />;
  }

  if (activeNav === 'attend') {
    return <AttendEventPage />;
  }

  if (activeNav === 'settings') {
    return <SettingsPage />;
  }

  // Default fallback route: Dashboard
  return <DashboardPage isFilterOpen={isFilterOpen} />;
};

export default AppRoutes;
