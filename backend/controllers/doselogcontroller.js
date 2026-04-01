const DoseLog = require('../models/DoseLog'); //test

const getDoseLogs = async (req, res) => {
    try {
        const logs = await DoseLog.find({ userId: req.user.id })
            .populate('medicationId', 'name dosage')
            .populate('reminderId', 'scheduledTime')
            .sort({ takenAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addDoseLog = async (req, res) => {
    const { medicationId, reminderId, status, notes } = req.body;
    try {
        const log = await DoseLog.create({
            userId: req.user.id,
            medicationId,
            reminderId,
            status,
            notes,
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDoseLogs, addDoseLog };