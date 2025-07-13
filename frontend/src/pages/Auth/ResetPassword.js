import React, { useState } from 'react';
import API from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import './AuthForm.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = location.state?.email || '';
  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: '',
    newPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await API.post('/auth/reset-password', formData);
      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="auth-container">
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        /><br />
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          required
          onChange={handleChange}
        /><br />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          required
          onChange={handleChange}
        /><br /><br />
        <button type="submit">Reset Password</button>
      </form>
    </div>
    </div>
  );
};

export default ResetPassword;
