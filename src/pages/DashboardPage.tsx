import React from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';
import { DashboardPageProps } from '../types';

export const DashboardPage: React.FC<DashboardPageProps> = ({ isFilterOpen }) => {
  return <Dashboard isFilterOpen={isFilterOpen} />;
};
