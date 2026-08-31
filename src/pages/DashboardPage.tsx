import React from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';
import { IDashboardPageProps } from '../types';

export const DashboardPage: React.FC<IDashboardPageProps> = ({ isFilterOpen }) => {
  return <Dashboard isFilterOpen={isFilterOpen} />;
};
