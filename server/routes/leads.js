const express = require('express');
const { createLead } = require('../controllers/leads');

const router = express.Router();

router.post('/', createLead);

module.exports = router;
