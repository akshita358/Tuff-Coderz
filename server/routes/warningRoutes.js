const express = require('express');
const router = express.Router();
const { getWarning } = require('../controllers/warningController');

// Minimal GET route; pass :userId to avoid modifying auth middleware or server config.
router.get('/:userId', getWarning);

module.exports = router;
