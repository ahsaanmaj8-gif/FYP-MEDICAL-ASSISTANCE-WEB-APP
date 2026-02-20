const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// =======================
// Create Prescription
// =======================
exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, medicines, tests, instructions, followUpDate } = req.body;

    const doctor = await Doctor.findOne({ user: req.user._id });
    
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctor._id
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      doctor: doctor._id,
      patient: appointment.patient,
      diagnosis,
      medicines: medicines || [],
      tests: tests || [],
      instructions,
      followUpDate
    });

    // Update appointment with prescription reference
    appointment.prescription = prescription._id;
    appointment.status = 'completed';
    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Prescriptions for Doctor
// =======================
exports.getPrescriptions = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    const prescriptions = await Prescription.find({ doctor: doctor._id })
      .populate('patient', 'name')
      .populate('appointment', 'appointmentDate')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: prescriptions });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Single Prescription
// =======================
exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findOne({ user: req.user._id });

    const prescription = await Prescription.findOne({ _id: id, doctor: doctor._id })
      .populate('patient', 'name email phone bloodGroup')
      .populate('appointment', 'appointmentDate');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.json({ success: true, data: prescription });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};