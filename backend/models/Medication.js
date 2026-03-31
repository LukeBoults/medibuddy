const mongoose = require('mongoose');
 
const medicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    form: { type: String, enum: ['tablet', 'liquid', 'capsule', 'injection', 'other'], default: 'tablet' },
    frequency: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    prescribingDoctor: { type: String },
    notes: { type: String },
}, { timestamps: true });
 
module.exports = mongoose.model('Medication', medicationSchema);