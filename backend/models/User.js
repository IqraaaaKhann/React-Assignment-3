import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Helper function to generate a unique username
const generateUsername = (email) => {
  const name = email.split('@')[0];
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${name}_${randomNum}`;
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'custom'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true
  },
  usernameUpdatedAt: {
    type: Date,
    default: null
  },
  profileImage: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

// 🔐 Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🆔 Generate unique username before saving
userSchema.pre('save', async function (next) {
  if (!this.username) {
    this.username = generateUsername(this.email);
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
