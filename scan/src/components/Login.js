import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import logo from './logo.png';
import WaitLoader from './WaitLoader';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    if (redirectTo) {
      const timer = setTimeout(() => {
        window.location.href = redirectTo;
      }, 2000); // Wait for 2 seconds before redirecting
      return () => clearTimeout(timer);
    }
  }, [redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
      username,
      password,
    }, {
      withCredentials: true,
    })
      .then((response) => {
        setRedirectTo(response.data.redirectTo);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred');
        }
        console.error(error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading || redirectTo) {
    return (
      <div className="login-loader">
        <WaitLoader />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Welcome Back</h2>
        <p>Please sign into your Capture account</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="login-input"
          />
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="login-input"
              style={{ paddingRight: '2.5rem' }}
            />
            <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} onClick={togglePasswordVisibility}></i>
          </div>
          <div className="reset-password-link">
            <a href="/reset-password">Reset Password</a>
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
