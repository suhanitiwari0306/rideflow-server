const express = require('express');
const router  = express.Router();
const { getDestinationSuggestions } = require('../controllers/aiController');
const { requireRider } = require('../middleware/requireAuth');

router.post('/destination-suggestions', requireRider, getDestinationSuggestions);

module.exports = router;