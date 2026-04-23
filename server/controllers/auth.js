const Admin = require('../models/Admin');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Login admin
// @route     POST /api/admin/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(admin, 200, res);
});

// @desc      Get current logged in admin
// @route     GET /api/admin/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: admin,
  });
});

// @desc      Create admin with hardcoded credentials
// @route     POST /api/admin/create-hardcoded
// @access    Public
exports.createHardcodedAdmin = asyncHandler(async (req, res, next) => {
  const hardcodedAdmin = {
    email: 'admin@royalcellspot.com',
    password: 'password123',
    role: 'admin',
  };

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: hardcodedAdmin.email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    // Create new admin
    const admin = await Admin.create(hardcodedAdmin);
    res.status(201).json({ success: true, data: admin });
  } catch (error) {
    next(new ErrorResponse('Failed to create admin', 500));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = admin.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};