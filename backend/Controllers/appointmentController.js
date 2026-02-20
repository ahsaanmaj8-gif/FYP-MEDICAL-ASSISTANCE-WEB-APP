const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// =======================
// Get Doctor Availability with Booked Slots
// =======================
// =======================
// Get Doctor Availability with Individual Booked Slots
// =======================
// =======================
// Get Doctor Availability with Individual Booked Slots
// =======================
exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    // Get doctor's availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get day name from date
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const selectedDate = new Date(date);
    const dayName = dayNames[selectedDate.getDay()];

    // Find doctor's availability for this day
    const dayAvailability = doctor.availability.find(a => a.day === dayName);
    
    if (!dayAvailability || !dayAvailability.slots || dayAvailability.slots.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No availability for this day',
        data: {
          doctor: {
            name: doctor.name,
            consultationFee: doctor.consultationFee,
            videoConsultationAvailable: doctor.videoConsultationAvailable || false
          },
          slots: []
        }
      });
    }

    // Get booked appointments for this doctor on this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['cancelled', 'no-show'] }
    });

    // Create a set of booked time slots
    const bookedSlots = new Set();
    bookedAppointments.forEach(app => {
      bookedSlots.add(app.appointmentTime);
    });

    // ✅ Show each individual time slot separately
    const slots = dayAvailability.slots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime || getEndTime(slot.startTime), // 30 mins later
      isAvailable: slot.isAvailable && !bookedSlots.has(slot.startTime),
      isBooked: bookedSlots.has(slot.startTime)
    }));

    res.status(200).json({
      success: true,
      data: {
        doctor: {
          name: doctor.name,
          consultationFee: doctor.consultationFee,
          videoConsultationAvailable: doctor.videoConsultationAvailable || false
        },
        slots: slots
      }
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability',
      error: error.message
    });
  }
};

// Helper function to calculate end time (30 minutes later)
const getEndTime = (startTime) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes + 30, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// =======================
// Book Appointment with JazzCash Payment
// =======================
exports.bookAppointment = async (req, res) => {
  try {
    const { 
      doctorId, 
      appointmentDate, 
      appointmentTime, 
      appointmentType,
      symptoms, 
      description 
    } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, date and time are required'
      });
    }

    // Check if doctor exists and is verified
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (!doctor.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Doctor is not verified'
      });
    }

    // Check if slot is already booked
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      appointmentTime: appointmentTime,
      status: { $nin: ['cancelled', 'no-show'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Check if appointment type is valid
    if (appointmentType === 'video-consultation' && !doctor.videoConsultationAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor does not offer video consultation'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      appointmentType: appointmentType || 'in-person',
      symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
      description: description || '',
      amount: doctor.consultationFee,
      paymentStatus: 'paid', // For demo, set as paid
      status: 'confirmed'
    });

    // Generate JazzCash payment response (mock)
    const jazzCashPayment = {
      transactionId: 'JC' + Date.now(),
      orderId: appointment._id,
      amount: doctor.consultationFee,
      paymentMethod: 'JazzCash',
      status: 'Success',
      message: 'Payment successful',
      timestamp: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointment: {
          _id: appointment._id,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
          type: appointment.appointmentType,
          amount: appointment.amount
        },
        payment: jazzCashPayment
      }
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
};

// =======================
// Get Patient Appointments
// =======================
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'specialization consultationFee videoConsultationAvailable')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email profilePicture'
        }
      })
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// =======================
// Cancel Appointment
// =======================
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason || 'Cancelled by patient';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};