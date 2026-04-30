const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Order = require('../models/Order');
const LabAppointment = require('../models/LabAppointment'); // Fixed import
const User = require('../models/User');

// =======================
// Get Patient Dashboard Stats
// =======================
exports.getDashboardStats = async (req, res) => {
  try {
    const patientId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upcoming appointments
    const upcomingAppointments = await Appointment.countDocuments({
      patient: patientId,
      appointmentDate: { $gte: today },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Active prescriptions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activePrescriptions = await Prescription.countDocuments({
      patient: patientId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Pending lab results
    const pendingLabResults = await LabAppointment.countDocuments({ // Fixed
      patient: patientId,
      status: 'pending'
    });

    // Total orders
    const totalOrders = await Order.countDocuments({ patient: patientId });

    res.json({
      success: true,
      data: {
        upcomingAppointments,
        activePrescriptions,
        pendingLabResults,
        totalOrders
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Patient Appointments
// =======================
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .sort({ appointmentDate: -1 });

    const formattedAppointments = appointments.map(apt => ({
      _id: apt._id,
      doctor: apt.doctor?.user?.name || 'Doctor',
      specialty: apt.doctor?.specialization || 'General',
      date: apt.appointmentDate,
      time: apt.appointmentTime,
      type: apt.appointmentType === 'video-consultation' ? 'Video Consultation' : 'In-Person',
      status: apt.status,
      amount: apt.amount,
      symptoms: apt.symptoms
    }));

    res.json({ success: true, data: formattedAppointments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Cancel Appointment
// =======================
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findOne({
      _id: id,
      patient: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = 'Cancelled by patient';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Patient Prescriptions
// =======================
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('appointment')
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
    
    const prescription = await Prescription.findOne({
      _id: id,
      patient: req.user._id
    })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('appointment');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.json({ success: true, data: prescription });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Patient Orders
// =======================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ patient: req.user._id })
      .populate('pharmacy', 'pharmacyName')
      .populate('items.medicine', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Patient's Lab Test Bookings
// =======================
exports.getLabTests = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    console.log('Fetching lab tests for patient:', patientId);

    // Find all lab appointments for this patient
    const labTests = await LabAppointment.find({ patient: patientId })
      .populate('laboratory', 'labName phone email address homeCollectionAvailable')
      .sort({ createdAt: -1 });

    console.log(`Found ${labTests.length} lab tests for patient`);

    // Format the data for frontend
    const formattedTests = labTests.map(test => ({
      _id: test._id,
      testName: test.testName,
      testId: test.testId,
      laboratory: {
        _id: test.laboratory?._id,
        name: test.laboratory?.labName || 'Laboratory',
        phone: test.laboratory?.phone,
        address: test.laboratory?.address
      },
      patientName: test.patientName,
      patientAge: test.patientAge,
      patientGender: test.patientGender,
      patientPhone: test.patientPhone,
      collectionDate: test.collectionDate,
      collectionType: test.collectionType,
      address: test.address,
      notes: test.notes,
      amount: test.amount,
      status: test.status,
      paymentStatus: test.paymentStatus,
      reportUrl: test.reportUrl,
      createdAt: test.createdAt
    }));

    res.json({ 
      success: true, 
      data: formattedTests 
    });

  } catch (error) {
    console.error('Error fetching lab tests:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// =======================
// Get Patient Profile
// =======================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Update Patient Profile
// =======================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bloodGroup, gender, dateOfBirth } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;

    await user.save();
    
    res.json({ success: true, message: 'Profile updated successfully', data: user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Recent Activity
// =======================
exports.getRecentActivity = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    // Get recent appointments
    const appointments = await Appointment.find({ patient: patientId })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .limit(3)
      .sort({ createdAt: -1 });

    // Get recent prescriptions
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .limit(3)
      .sort({ createdAt: -1 });

    // Get recent orders
    const orders = await Order.find({ patient: patientId })
      .limit(3)
      .sort({ createdAt: -1 });

    // Combine and sort by date
    const activities = [
      ...appointments.map(a => ({
        type: 'appointment',
        title: `Appointment with ${a.doctor?.user?.name || 'Doctor'}`,
        time: a.createdAt,
        status: a.status,
        icon: '👨‍⚕️'
      })),
      ...prescriptions.map(p => ({
        type: 'prescription',
        title: `Prescription from ${p.doctor?.user?.name || 'Doctor'}`,
        time: p.createdAt,
        status: 'completed',
        icon: '💊'
      })),
      ...orders.map(o => ({
        type: 'order',
        title: `Medicine order #${o.orderNumber}`,
        time: o.createdAt,
        status: o.status,
        icon: '🛒'
      }))
    ];

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    res.json({ success: true, data: activities.slice(0, 5) });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
