const express = require('express');
const { getReminders, getReminder, addReminder, updateReminder, deleteReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getReminders);
router.get('/:id', protect, getReminder);
router.post('/', protect, addReminder);
router.put('/:id', protect, updateReminder);
router.delete('/:id', protect, deleteReminder);

module.exports = router;