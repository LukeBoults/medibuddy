const mongoose = require('mongoose');
 
const doseLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
    reminderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reminder', required: true },
    status: { type: String, enum: ['taken', 'skipped', 'snoozed'], required: true },
    takenAt: { type: Date, default: Date.now },
    notes: { type: String },
}, { timestamps: true });
 
module.exports = mongoose.model('DoseLog', doseLogSchema);