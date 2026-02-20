const Laboratory = require('../models/Laboratory');
const LabTest = require('../models/LabTest');
const LabAppointment = require('../models/LabAppointment');
const User = require('../models/User');

// =======================
// Get Laboratory Dashboard Stats
// =======================
const getDashboardStats = async (req, res) => {
  try {
    const lab = await Laboratory.findOne({ user: req.user._id });
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's appointments
    const todayAppointments = await LabAppointment.countDocuments({
      laboratory: lab._id,
      collectionDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Pending results
    const pendingResults = await LabAppointment.countDocuments({
      laboratory: lab._id,
      status: { $in: ['sample_collected', 'processing'] }
    });

    // Total tests
    const totalTests = await LabTest.countDocuments({ laboratory: lab._id });

    // Recent earnings (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentEarnings = await LabAppointment.aggregate([
      {
        $match: {
          laboratory: lab._id,
          status: 'completed',
          createdAt: { $gte: weekAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        todayAppointments,
        pendingResults,
        totalTests,
        recentEarnings: recentEarnings[0]?.total || 0,
        labName: lab.labName,
        isVerified: lab.isVerified
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// =======================
// Get All Tests for Lab
// =======================
// =======================
// Get All Tests for Lab
// =======================
const getTests = async (req, res) => {
  try {
    const lab = await Laboratory.findOne({ user: req.user._id });
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    // Get tests from LabTest collection
    const labTests = await LabTest.find({ laboratory: lab._id });
    
    // Convert lab's testsAvailable to same format
    const registrationTests = lab.testsAvailable ? lab.testsAvailable.map((test, index) => ({
      _id: `reg-${lab._id}-${index}`,
      testName: test.testName, // Use testName consistently
      name: test.testName, // Keep name for backward compatibility
      category: test.category,
      price: test.price,
      duration: test.duration || '24 hours',
      description: test.description || '',
      laboratory: lab._id,
      isActive: true,
      source: 'registration'
    })) : [];

    // Combine both
    const allTests = [
      ...registrationTests,
      ...labTests.map(test => ({
        ...test.toObject(),
        name: test.testName, // Add name field for frontend compatibility
        source: 'added'
      }))
    ];

    res.status(200).json({
      success: true,
      data: allTests
    });

  } catch (error) {
    console.error('Error in getTests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// =======================
// Add New Test
// =======================
// =======================
// Add New Test
// =======================
const addTest = async (req, res) => {
  try {
    const lab = await Laboratory.findOne({ user: req.user._id });
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    const { name, category, price, duration, description } = req.body;

    console.log('Adding test with data:', { name, category, price, duration, description }); // Debug log

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required'
      });
    }

    // 1. Save to LabTest collection
    const test = new LabTest({
      testName: name, // Use testName if model expects it
      category,
      price: parseFloat(price),
      duration: duration || '24 hours',
      description: description || '',
      laboratory: lab._id,
      isActive: true
    });
    
    await test.save();
    console.log('Test saved to LabTest:', test._id); // Debug log

    // 2. ALSO add to Laboratory.testsAvailable for public access
    lab.testsAvailable = lab.testsAvailable || [];
    lab.testsAvailable.push({
      testName: name,
      category,
      price: parseFloat(price),
      duration: duration || '24 hours',
      description: description || ''
    });
    
    await lab.save();
    console.log('Test added to lab.testsAvailable'); // Debug log

    res.status(201).json({
      success: true,
      message: 'Test added successfully',
      data: test
    });

  } catch (error) {
    console.error('Error in addTest:', error); // IMPORTANT: See exact error
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message // Include error message
    });
  }
};
// =======================
// Update Test Status
// =======================
const updateTestStatus = async (req, res) => {
  try {
    const { testId } = req.params;
    const { isActive } = req.body;

    const test = await LabTest.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    test.isActive = isActive;
    await test.save();

    res.status(200).json({
      success: true,
      message: `Test ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: test
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// =======================
// Get Lab Appointments
// =======================
const getAppointments = async (req, res) => {
  try {
    const lab = await Laboratory.findOne({ user: req.user._id });
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    const { status, date } = req.query;
    let query = { laboratory: lab._id };

    if (status) {
      query.status = status;
    }

    if (date) {
      const selectedDate = new Date(date);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      query.collectionDate = {
        $gte: selectedDate,
        $lt: nextDate
      };
    }

    const appointments = await LabAppointment.find(query)
      .populate('patient', 'name phone email')
      .sort({ collectionDate: 1 });

    res.status(200).json({
      success: true,
      data: appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// =======================
// Update Appointment Status
// =======================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const appointment = await LabAppointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment status updated',
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// =======================
// Upload Report
// =======================
const uploadReport = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Get file from Cloudinary (if using file uploader middleware)
    const reportUrl = req.file?.path || req.file?.filename || req.body.reportUrl;
    
    if (!reportUrl) {
      return res.status(400).json({
        success: false,
        message: 'Report file or URL is required'
      });
    }

    const appointment = await LabAppointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.reportUrl = reportUrl;
    appointment.status = 'completed';
    appointment.reportUploadedAt = new Date();
    
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Report uploaded successfully',
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// =======================
// Get Lab Earnings
// =======================
const getEarnings = async (req, res) => {
  try {
    const lab = await Laboratory.findOne({ user: req.user._id });
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    const { period = 'monthly' } = req.query;
    let startDate = new Date();
    
    if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const earnings = await LabAppointment.aggregate([
      {
        $match: {
          laboratory: lab._id,
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalAppointments: { $sum: 1 }
        }
      }
    ]);

    // Popular tests
    const popularTests = await LabAppointment.aggregate([
      {
        $match: {
          laboratory: lab._id,
          status: 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$testName',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$amount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAmount: earnings[0]?.totalAmount || 0,
        totalAppointments: earnings[0]?.totalAppointments || 0,
        popularTests
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getTests,
  addTest,
  updateTestStatus,
  getAppointments,
  updateAppointmentStatus,
  uploadReport,
  getEarnings
};