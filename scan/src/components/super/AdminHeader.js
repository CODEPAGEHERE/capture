import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import WaitLoader from '../WaitLoader';

const apiUrl = process.env.REACT_APP_API_URL;

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(`${apiUrl}/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setTimeout(() => {
        navigate('/');
      }, 2000); // Wait for 2 seconds before redirecting
    }
  };

  return (
    <header className="admin-header">
      <nav className="admin-nav">
        <div className="admin-logo">
          <img src="logo.png" alt="Logo" className="logo" />
          <Link to="/office" className="admin-logo-link">
            Super Dashboard
          </Link>
        </div>
        <div className="admin-nav-links-container">
          <button className="menu-toggle" onClick={toggleMenu}>
            <i className={isOpen ? "bi bi-x" : "bi bi-list"}></i>
          </button>
          <ul className={`admin-nav-links ${isOpen ? "open" : ""}`}>
            <li>
              <Link to="onboarding" className="admin-nav-link">
                <i className="bi bi-person-plus"></i> Onboard
              </Link>
            </li>
            <li>
              <Link to="users" className="admin-nav-link">
                <i className="bi bi-people"></i> Users
              </Link>
            </li>
            <li>
              <Link to="roles" className="admin-nav-link">
                <i className="bi bi-person-check"></i> Roles
              </Link>
            </li>
            <li>
              <Link to="settings" className="admin-nav-link">
                <i className="bi bi-gear"></i> Settings
              </Link>
            </li>
            <li>
              <Link to="logs" className="admin-nav-link">
                <i className="bi bi-file-earmark-text"></i> Logs
              </Link>
            </li>
            <li>
              <button className="admin-nav-link button" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {isLoggingOut && <WaitLoader />}
    </header>
  );
};

export default AdminHeader;
