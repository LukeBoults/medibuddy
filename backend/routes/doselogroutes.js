const express = require('express');
const { getDoseLogs, addDoseLog } = require('../controllers/doselogcontroller');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getDoseLogs);
router.post('/', protect, addDoseLog);

module.exports = router;
