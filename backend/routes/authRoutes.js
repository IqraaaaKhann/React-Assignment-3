import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import {
  signupUser,
  loginUser,
  sendOTP,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// 👇 Setup for uploading profile and cover images
const uploadFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// 👤 Signup with image upload
router.post('/signup', uploadFields, signupUser);

// 🔐 Login
router.post('/login', loginUser);

// 🔁 Forgot password - send OTP
router.post('/forgot-password', sendOTP);

// 🔄 Reset password with OTP
router.post('/reset-password', resetPassword);

export default router;
