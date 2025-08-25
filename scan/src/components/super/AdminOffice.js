import React from 'react';
import { Outlet } from 'react-router-dom';
import './AdminOffice.css';
import Footer from '../Footer';
import AdminHeader from './AdminHeader';

const AdminOffice = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <main className="admin-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminOffice;
