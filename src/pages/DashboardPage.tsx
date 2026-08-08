import React from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';

interface DashboardPageProps {
  isFilterOpen: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ isFilterOpen }) => {
  return <Dashboard isFilterOpen={isFilterOpen} />;
};
