const Medication = require('../models/Medication');

const getMedications = async (req, res) => {
    try {
        const medications = await Medication.find({ userId: req.user.id });
        res.json(medications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);
        if (!medication) return res.status(404).json({ message: 'Medication not found' });
        res.json(medication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addMedication = async (req, res) => {
    const { name, dosage, form, frequency, startDate, endDate, prescribingDoctor, notes } = req.body;
    try {
        const medication = await Medication.create({
            userId: req.user.id,
            name,
            dosage,
            form,
            frequency,
            startDate,
            endDate,
            prescribingDoctor,
            notes,
        });
        res.status(201).json(medication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMedication = async (req, res) => {
    const { name, dosage, form, frequency, startDate, endDate, prescribingDoctor, notes } = req.body;
    try {
        const medication = await Medication.findById(req.params.id);
        if (!medication) return res.status(404).json({ message: 'Medication not found' });

        medication.name = name || medication.name;
        medication.dosage = dosage || medication.dosage;
        medication.form = form || medication.form;
        medication.frequency = frequency || medication.frequency;
        medication.startDate = startDate || medication.startDate;
        medication.endDate = endDate || medication.endDate;
        medication.prescribingDoctor = prescribingDoctor || medication.prescribingDoctor;
        medication.notes = notes || medication.notes;

        const updatedMedication = await medication.save();
        res.json(updatedMedication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);
        if (!medication) return res.status(404).json({ message: 'Medication not found' });
        await medication.deleteOne();
        res.json({ message: 'Medication deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMedications, getMedication, addMedication, updateMedication, deleteMedication };