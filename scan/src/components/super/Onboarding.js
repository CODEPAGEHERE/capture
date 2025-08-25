import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Onboarding.css';

const apiUrl = process.env.REACT_APP_API_URL;

const sanitizePhoneNumber = (value) => {
  return value.replace(/\D+/g, '');
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [schoolData, setSchoolData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    about: '',
    motto: '',
    color: '',
    logo: null,
  });
  const [userData, setUserData] = useState({
    fullName: '',
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    address: '',
    roleId: '',
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/onboarding/roles`);
        setRoles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoles();
  }, []);

  const handleSchoolChange = (e) => {
    if (e.target.name === 'phoneNumber') {
      setSchoolData({ ...schoolData, [e.target.name]: sanitizePhoneNumber(e.target.value) });
    } else {
      setSchoolData({ ...schoolData, [e.target.name]: e.target.value });
    }
  };

  const handleUserChange = (e) => {
    if (e.target.name === 'phoneNumber') {
      setUserData({ ...userData, [e.target.name]: sanitizePhoneNumber(e.target.value) });
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  const handleLogoChange = (e) => {
    setSchoolData({ ...schoolData, logo: e.target.files[0] });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedSchoolData = {
        name: schoolData.name.trim().toLowerCase(),
        email: schoolData.email.trim().toLowerCase(),
        phoneNumber: schoolData.phoneNumber,
        address: schoolData.address.trim(),
        about: schoolData.about.trim(),
        motto: schoolData.motto.trim(),
        color: schoolData.color,
        logo: schoolData.logo,
      };

      const sanitizedUserData = {
        fullName: userData.fullName.trim(),
        username: userData.username.trim().toLowerCase(),
        password: userData.password,
        email: userData.email.trim().toLowerCase(),
        phoneNumber: userData.phoneNumber,
        address: userData.address.trim(),
        roleId: userData.roleId,
      };

      const formData = new FormData();
      formData.append('schoolName', sanitizedSchoolData.name);
      formData.append('schoolEmail', sanitizedSchoolData.email);
      formData.append('schoolPhoneNumber', sanitizedSchoolData.phoneNumber);
      formData.append('schoolAddress', sanitizedSchoolData.address);
      formData.append('schoolAbout', sanitizedSchoolData.about);
      formData.append('schoolMotto', sanitizedSchoolData.motto);
      formData.append('schoolColor', sanitizedSchoolData.color);
      formData.append('schoolLogo', sanitizedSchoolData.logo);
      formData.append('fullName', sanitizedUserData.fullName);
      formData.append('username', sanitizedUserData.username);
      formData.append('password', sanitizedUserData.password);
      formData.append('email', sanitizedUserData.email);
      formData.append('phoneNumber', sanitizedUserData.phoneNumber);
      formData.append('address', sanitizedUserData.address);
      formData.append('roleId', sanitizedUserData.roleId);

      const response = await axios.post(`${apiUrl}/onboarding`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.message);
      console.error(error);
    }
  };

  return (
    // Your JSX code remains the same
    <div className="onboarding-container">
      <h1>Onboarding New School and User</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {step === 1 ? (
        <form className="onboarding-form" onSubmit={handleNextStep}>
          <h2>School Information</h2>
          <div className="form-group">
            <label>School Name:</label>
            <input type="text" name="name" value={schoolData.name} onChange={handleSchoolChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={schoolData.email} onChange={handleSchoolChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={schoolData.phoneNumber} onChange={handleSchoolChange} required />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" value={schoolData.address} onChange={handleSchoolChange} required />
          </div>
          <div className="form-group">
            <label>About:</label>
            <textarea name="about" value={schoolData.about} onChange={handleSchoolChange} />
          </div>
          <div className="form-group">
            <label>Motto:</label>
            <input type="text" name="motto" value={schoolData.motto} onChange={handleSchoolChange} />
          </div>
          <div className="form-group">
            <label>Color:</label>
            <input type="color" name="color" value={schoolData.color} onChange={handleSchoolChange} />
          </div>
          <div className="form-group">
            <label>Logo:</label>
            <input type="file" name="logo" onChange={handleLogoChange} />
          </div>
          <button className="btn btn-primary" type="submit">Next</button>
        </form>
      ) : (
        <form className="onboarding-form" onSubmit={handleSubmit}>
          <h2>User Information</h2>
          <div className="form-group">
            <label>Full Name:</label>
            <input type="text" name="fullName" value={userData.fullName} onChange={handleUserChange} required />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select name="roleId" value={userData.roleId} onChange={handleUserChange} required>
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" name="username" value={userData.username} onChange={handleUserChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={userData.password} onChange={handleUserChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={userData.email} onChange={handleUserChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="tel" name="phoneNumber" value={userData.phoneNumber} onChange={handleUserChange} required />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" value={userData.address} onChange={handleUserChange} required />
          </div>
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Onboarding;
