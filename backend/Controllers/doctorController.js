const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Prescription = require('../models/Prescription');

// =======================
// Get Doctor Dashboard Stats
// =======================
exports.getDashboardStats = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['confirmed', 'scheduled'] }
    });

    // Pending consultations (today's pending)
    const pendingConsultations = await Appointment.countDocuments({
      doctor: doctor._id,
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: 'scheduled'
    });

    // Total patients (unique)
    const totalPatients = await Appointment.distinct('patient', { doctor: doctor._id }).countDocuments();

    // This month's earnings
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const completedAppointments = await Appointment.find({
      doctor: doctor._id,
      status: 'completed',
      appointmentDate: { $gte: monthStart, $lte: monthEnd }
    });

    const monthlyEarnings = completedAppointments.reduce((sum, apt) => sum + apt.amount, 0);

    res.json({
      success: true,
      data: {
        todayAppointments,
        pendingConsultations,
        totalPatients,
        monthlyEarnings,
        doctorName: req.user.name,
        rating: doctor.rating?.average || 4.5
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Doctor Appointments
// =======================
exports.getAppointments = async (req, res) => {
  try {
    const { filter } = req.query; // today, upcoming, completed
    
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let query = { doctor: doctor._id };
    
    if (filter === 'today') {
      query.appointmentDate = { $gte: today, $lt: tomorrow };
      query.status = { $in: ['scheduled', 'confirmed', 'in-progress'] }; // Include in-progress
    } else if (filter === 'upcoming') {
      query.appointmentDate = { $gte: tomorrow };
      query.status = { $in: ['scheduled', 'confirmed'] };
    } else if (filter === 'completed') {
      query.status = 'completed'; // ✅ This should return all completed appointments
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });

    res.json({ success: true, data: appointments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// =======================
// Update Appointment Status
// =======================
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating appointment:', id, 'to status:', status);

    // Validate status
    const validStatuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Find doctor associated with logged-in user
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }

    // Find appointment that belongs to this doctor
    const appointment = await Appointment.findOne({ 
      _id: id, 
      doctor: doctor._id 
    });

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found or does not belong to you' 
      });
    }

    // Update status
    appointment.status = status;
    appointment.updatedAt = new Date();
    await appointment.save();

    console.log('Appointment updated successfully:', appointment._id);

    res.json({ 
      success: true, 
      message: 'Appointment updated successfully',
      data: appointment 
    });

  } catch (error) {
    console.error('Error updating appointment status:', error);
    
    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
// =======================
// Get Doctor Patients
// =======================
exports.getPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    // Get unique patients who had appointments with this doctor
    const patientIds = await Appointment.distinct('patient', { doctor: doctor._id });
    
    const patients = await User.find({ _id: { $in: patientIds } })
      .select('name email phone gender bloodGroup')
      .sort({ name: 1 });

    // Get appointment count for each patient
    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({
          doctor: doctor._id,
          patient: patient._id
        });
        
        const lastAppointment = await Appointment.findOne({
          doctor: doctor._id,
          patient: patient._id
        }).sort({ appointmentDate: -1 });

        return {
          ...patient.toObject(),
          appointmentCount,
          lastVisit: lastAppointment?.appointmentDate
        };
      })
    );

    res.json({ success: true, data: patientsWithStats });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Single Patient Details
// =======================
exports.getPatientDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findOne({ user: req.user._id });

    const patient = await User.findById(id).select('-password');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Get patient's appointments with this doctor
    const appointments = await Appointment.find({
      doctor: doctor._id,
      patient: id
    }).sort({ appointmentDate: -1 });

    // Get prescriptions for this patient
    const prescriptions = await Prescription.find({
      doctor: doctor._id,
      patient: id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        patient,
        appointments,
        prescriptions
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Doctor Earnings
// =======================
exports.getEarnings = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    // All time earnings
    const allAppointments = await Appointment.find({
      doctor: doctor._id,
      status: 'completed'
    });

    const totalEarnings = allAppointments.reduce((sum, apt) => sum + apt.amount, 0);
    const totalConsultations = allAppointments.length;

    // This month
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const thisMonthAppointments = allAppointments.filter(apt => 
      apt.appointmentDate >= monthStart && apt.appointmentDate <= monthEnd
    );

    const thisMonthEarnings = thisMonthAppointments.reduce((sum, apt) => sum + apt.amount, 0);
    const thisMonthConsultations = thisMonthAppointments.length;

    res.json({
      success: true,
      data: {
        totalEarnings,
        thisMonthEarnings,
        totalConsultations,
        thisMonthConsultations
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Doctor Profile
// =======================
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'name email phone profilePicture');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({ success: true, data: doctor });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Update Doctor Profile
// =======================
exports.updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    const { bio, consultationFee, followUpFee } = req.body;
    
    if (bio) doctor.bio = bio;
    if (consultationFee) doctor.consultationFee = consultationFee;
    if (followUpFee) doctor.followUpFee = followUpFee;

    await doctor.save();
    
    res.json({ success: true, message: 'Profile updated successfully', data: doctor });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Doctor Schedule
// =======================
exports.getSchedule = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).select('availability');
    res.json({ success: true, data: doctor.availability });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.updateSchedule = async (req, res) => {
  try {
    const { availability } = req.body;
    
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Validate availability format
    if (!Array.isArray(availability)) {
      return res.status(400).json({ success: false, message: 'Invalid schedule format' });
    }

    doctor.availability = availability;
    await doctor.save();

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: doctor.availability
    });

  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};