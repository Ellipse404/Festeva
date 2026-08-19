import React from 'react';
import { useApp } from '../hooks/useApp';
import { LoginPage } from '../pages/LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useApp();

  if (!user || !user.isLoggedIn) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
