const express = require('express');
const { login, getMe, createHardcodedAdmin } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/create-hardcoded', createHardcodedAdmin);

module.exports = router;