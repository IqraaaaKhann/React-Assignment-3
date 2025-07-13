import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import generateOTP from '../utils/generateOTP.js';
import sendOTPEmail from '../utils/emailService.js';

// 🔐 Generate JWT Token
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// ✅ Signup Controller
export const signupUser = async (req, res) => {
  try {
    const { email, password, dob, gender, phone } = req.body;

    // Validation
    if (!email || !password || !dob || !gender || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Age check
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 15) {
      return res.status(400).json({ message: 'User must be at least 15 years old' });
    }

    // Gender check
    if (!['male', 'female', 'custom'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender selected' });
    }

    // Phone number validation
    if (!phone.startsWith('+')) {
      return res.status(400).json({ message: 'Phone must include country code (e.g., +92...)' });
    }

    // Password rules
    const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRules.test(password)) {
      return res.status(400).json({
        message:
          'Password must include uppercase, lowercase, number, special character and be 8+ characters'
      });
    }

    // Upload images
    const profileImage = req.files?.profileImage?.[0]?.filename || '';
    const coverImage = req.files?.coverImage?.[0]?.filename || '';

    const newUser = new User({
      email,
      password,
      dob,
      gender,
      phone,
      profileImage,
      coverImage
    });

    await newUser.save();

    const token = createToken(newUser);

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        email: newUser.email,
        username: newUser.username,
        profileImage: newUser.profileImage,
        coverImage: newUser.coverImage
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

// ✅ Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = createToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        coverImage: user.coverImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// ✅ Send OTP to Email
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = { code: otp, expiresAt: expiry };
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

// ✅ Reset Password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp || user.otp.code !== otp || new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Password validation
    const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRules.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password must include uppercase, lowercase, number, special character and be 8+ characters'
      });
    }

    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
};
