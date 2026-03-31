const express = require('express');
const { getMedications, getMedication, addMedication, updateMedication, deleteMedication } = require('../controllers/medicationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getMedications);
router.get('/:id', protect, getMedication);
router.post('/', protect, addMedication);
router.put('/:id', protect, updateMedication);
router.delete('/:id', protect, deleteMedication);

module.exports = router;