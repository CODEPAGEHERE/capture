import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminOffice.css';

const AdminOffice = () => {
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <nav className="admin-nav">
          <div className="admin-logo">
            <h1>Admin Dashboard</h1>
          </div>
          <ul className="admin-nav-links">
            <li>
              <Link to="users" className="admin-nav-link">Users</Link>
            </li>
            <li>
              <Link to="roles" className="admin-nav-link">Roles</Link>
            </li>
            <li>
              <Link to="settings" className="admin-nav-link">Settings</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminOffice;
