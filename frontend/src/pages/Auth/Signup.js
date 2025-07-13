import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import './AuthForm.css';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    dob: '',
    gender: '',
    phone: '',
    profileImage: null,
    coverImage: null
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await API.post('/auth/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage(res.data.message);

      // ✅ Redirect to login after 1 second
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div style={{ maxWidth: '500px', margin: 'auto' }}>
        <h2>Signup</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <br />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <br />
          <input type="date" name="dob" required onChange={handleChange} />
          <br />
          <select name="gender" required onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="custom">Custom</option>
          </select>
          <br />
          <input type="text" name="phone" placeholder="+923001234567" required onChange={handleChange} />
          <br />
          <label>Profile Image: </label>
          <input type="file" name="profileImage" accept="image/*" onChange={handleChange} />
          <br />
          <label>Cover Image: </label>
          <input type="file" name="coverImage" accept="image/*" onChange={handleChange} />
          <br /><br />
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
