import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// 🧾 Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load profile', error: error.message });
  }
};

// 🖼️ Update profile & cover images
export const updateImages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.files?.profileImage) {
      user.profileImage = req.files.profileImage[0].filename;
    }
    if (req.files?.coverImage) {
      user.coverImage = req.files.coverImage[0].filename;
    }

    await user.save();

    res.status(200).json({
      message: 'Images updated successfully',
      profileImage: user.profileImage,
      coverImage: user.coverImage
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update images', error: error.message });
  }
};

// 🔄 Update username (only after 24 hrs)
export const updateUsername = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { username } = req.body;

    const now = new Date();
    const lastUpdated = user.usernameUpdatedAt || new Date(user.createdAt);
    const hoursPassed = (now - lastUpdated) / (1000 * 60 * 60);

    if (hoursPassed < 24) {
      return res.status(400).json({
        message: 'You can only update your username once every 24 hours.'
      });
    }

    user.username = username;
    user.usernameUpdatedAt = new Date();

    await user.save();

    res.status(200).json({ message: 'Username updated successfully', username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Username update failed', error: error.message });
  }
};

// 🔐 Change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    // Validate new password
    const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRules.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password must include uppercase, lowercase, number, special character and be 8+ characters'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password change failed', error: error.message });
  }
};
