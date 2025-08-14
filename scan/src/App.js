import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminOffice from './components/super/AdminOffice';
import AdminDashboard from './components/AdminDashboard';
import AssistDashboard from './components/AssistDashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Unauthorized from './components/UnauthorizedPage';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/office"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']} allowedRoleTypes={['SUPERADMIN']}>
              <AdminOffice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']} allowedRoleTypes={['SUPERADMIN', 'SUBADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assist"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STAFF' ]} >
              <AssistDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
