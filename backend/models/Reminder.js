const mongoose = require('mongoose');
 
const reminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
    scheduledTime: { type: String, required: true },
    frequencyType: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
    isActive: { type: Boolean, default: true },
    endDate: { type: Date },
    notes: { type: String },
}, { timestamps: true });
 
module.exports = mongoose.model('Reminder', reminderSchema);