import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  returnToPage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children
}) => {
  // Only authentication logic can be added here if needed
  return <>{children}</>;
};

export default ProtectedRoute;
