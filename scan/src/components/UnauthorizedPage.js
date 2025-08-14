import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 9000); // redirect after 9 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have the permission to access this page.</p>
      <p>Redirecting you to login page...</p>
    </div>
  );
};

export default UnauthorizedPage;
