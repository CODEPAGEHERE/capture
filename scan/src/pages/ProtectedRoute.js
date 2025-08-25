import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import WaitLoader from '../components/WaitLoader';

const apiUrl = process.env.REACT_APP_API_URL;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/validate-token`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUserRole(response.data.role);
      } catch {
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <WaitLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
