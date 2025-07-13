import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message);

      // Navigate to reset password page and pass email
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <div className="auth-container">
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your registered email"
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />
        <button type="submit">Send OTP</button>
      </form>
    </div>
    </div>
  );
};

export default ForgotPassword;
