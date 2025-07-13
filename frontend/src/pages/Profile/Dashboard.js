import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState('');
  const [imageForm, setImageForm] = useState({ profileImage: null, coverImage: null });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });

  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    if (!token) return navigate('/login');
    API.get('/user/profile', config)
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        setMessage('Failed to load profile');
      });
  }, [token, navigate]);

  // Update username
  const handleUsernameUpdate = async () => {
    try {
      const res = await API.put('/user/update-username', { username: newUsername }, config);
      setMessage(res.data.message);
      setUser(prev => ({ ...prev, username: newUsername }));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Username update failed');
    }
  };

  // Update images
  const handleImageUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imageForm.profileImage) data.append('profileImage', imageForm.profileImage);
    if (imageForm.coverImage) data.append('coverImage', imageForm.coverImage);

    try {
      const res = await API.put('/user/update-images', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(res.data.message);
      setUser(prev => ({
        ...prev,
        profileImage: res.data.profileImage,
        coverImage: res.data.coverImage
      }));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Image update failed');
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/user/change-password', passwordForm, config);
      setMessage(res.data.message);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {message && <p>{message}</p>}

      <div className="section">
        <h3>Welcome, {user.username}</h3>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="section image-preview">
        {user.profileImage && (
          <div>
            <label>Profile Image</label>
            <img
              src={`http://localhost:5000/uploads/${user.profileImage}`}
              alt="Profile"
            />
          </div>
        )}
        {user.coverImage && (
          <div>
            <label>Cover Image</label>
            <img
              src={`http://localhost:5000/uploads/${user.coverImage}`}
              alt="Cover"
            />
          </div>
        )}
      </div>

      <div className="section">
        <h3>Update Username</h3>
        <input
          type="text"
          placeholder="New Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleUsernameUpdate}>Update Username</button>
      </div>

      <div className="section">
        <h3>Update Images</h3>
        <form onSubmit={handleImageUpdate}>
          <label>Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageForm({ ...imageForm, profileImage: e.target.files[0] })
            }
          />
          <label>Cover Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageForm({ ...imageForm, coverImage: e.target.files[0] })
            }
          />
          <button type="submit">Update Images</button>
        </form>
      </div>

      <div className="section">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            required
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
            }
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            required
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
