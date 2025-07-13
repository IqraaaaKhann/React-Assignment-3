import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

import {
  getProfile,
  updateImages,
  updateUsername,
  changePassword
} from '../controllers/userController.js';

const router = express.Router();

const uploadFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// 🧾 Get user profile
router.get('/profile', protect, getProfile);

// 🖼️ Update profile or cover images
router.put('/update-images', protect, uploadFields, updateImages);

// ✏️ Update username (after 24 hours)
router.put('/update-username', protect, updateUsername);

// 🔐 Change password (old + new)
router.put('/change-password', protect, changePassword);

export default router;
