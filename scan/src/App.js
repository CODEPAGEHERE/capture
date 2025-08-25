import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';

import Login from './components/Login';
import Unauthorized from './components/UnauthorizedPage';

import AdminOffice from './components/super/AdminOffice';
import OfficeDashboard from './components/super/OfficeDashboard';
import Onboarding from './components/super/Onboarding';

import AdminDashboard from './components/AdminDashboard';
import AssistDashboard from './components/AssistDashboard';

import ProtectedRoute from './pages/ProtectedRoute';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/office"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminOffice>
                <Outlet />
              </AdminOffice>
            </ProtectedRoute>
          }
        >
          <Route index element={<OfficeDashboard />} />
          <Route path="onboarding" element={<Onboarding />} />
        </Route>


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['main_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/assist"
          element={
            <ProtectedRoute allowedRoles={['min_admin']}>
              <AssistDashboard />
            </ProtectedRoute>
          }
        />

        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
