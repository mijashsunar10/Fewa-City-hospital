import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user / admin
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecretKey } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    // Require admin secret key if trying to register as admin
    if (role === 'admin') {
      const secret = process.env.ADMIN_SECRET_KEY || 'fewacity-admin-2026';
      if (!adminSecretKey || adminSecretKey !== secret) {
        res.status(401);
        return next(new Error('Invalid administrator registration key'));
      }
    }

    // Create user (accept role if provided, defaults to 'user' in schema)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob || null,
        address: user.address || '',
        bloodGroup: user.bloodGroup || '',
        medicalHistory: user.medicalHistory || '',
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user (must select password explicitly as it is select: false in schema)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob || null,
        address: user.address || '',
        bloodGroup: user.bloodGroup || '',
        medicalHistory: user.medicalHistory || '',
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob || null,
        address: user.address || '',
        bloodGroup: user.bloodGroup || '',
        medicalHistory: user.medicalHistory || '',
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.gender !== undefined) user.gender = req.body.gender;
      if (req.body.dob !== undefined) user.dob = req.body.dob;
      if (req.body.address !== undefined) user.address = req.body.address;
      if (req.body.bloodGroup !== undefined) user.bloodGroup = req.body.bloodGroup;
      if (req.body.medicalHistory !== undefined) user.medicalHistory = req.body.medicalHistory;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone || '',
        gender: updatedUser.gender || '',
        dob: updatedUser.dob || null,
        address: updatedUser.address || '',
        bloodGroup: updatedUser.bloodGroup || '',
        medicalHistory: updatedUser.medicalHistory || '',
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};
