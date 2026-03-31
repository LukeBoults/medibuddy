const Reminder = require('../models/Reminder');

const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ userId: req.user.id }).populate('medicationId', 'name dosage');
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id).populate('medicationId', 'name dosage');
        if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
        res.json(reminder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addReminder = async (req, res) => {
    const { medicationId, scheduledTime, frequencyType, endDate, notes } = req.body;
    try {
        const reminder = await Reminder.create({
            userId: req.user.id,
            medicationId,
            scheduledTime,
            frequencyType,
            endDate,
            notes,
        });
        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReminder = async (req, res) => {
    const { scheduledTime, frequencyType, isActive, endDate, notes } = req.body;
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

        reminder.scheduledTime = scheduledTime || reminder.scheduledTime;
        reminder.frequencyType = frequencyType || reminder.frequencyType;
        reminder.isActive = isActive ?? reminder.isActive;
        reminder.endDate = endDate || reminder.endDate;
        reminder.notes = notes || reminder.notes;

        const updatedReminder = await reminder.save();
        res.json(updatedReminder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
        await reminder.deleteOne();
        res.json({ message: 'Reminder deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReminders, getReminder, addReminder, updateReminder, deleteReminder };