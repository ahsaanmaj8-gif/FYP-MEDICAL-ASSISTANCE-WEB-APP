const Laboratory = require('../models/Laboratory');
const LabAppointment = require('../models/LabAppointment');

// =======================
// Get All Available Lab Tests
// =======================
const getLabTests = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    const labs = await Laboratory.find({ 
      isVerified: true, 
      isActive: true 
    }).populate('user', 'name phone email');

    let allTests = [];
    
    labs.forEach(lab => {
      if (lab.testsAvailable && lab.testsAvailable.length > 0) {
        lab.testsAvailable.forEach((test, index) => {
          allTests.push({
            testId: `${lab._id}-${test.testName.replace(/\s+/g, '-').toLowerCase()}-${index}`,
            testName: test.testName,
            category: test.category,
            price: test.price,
            duration: test.duration,
            description: test.description,
            lab: {
              _id: lab._id,
              name: lab.labName,
              phone: lab.phone || lab.user?.phone,
              email: lab.email || lab.user?.email,
              address: lab.address,
              homeCollectionAvailable: lab.homeCollectionAvailable
            }
          });
        });
      }
    });

    // Apply filters
    let filteredTests = allTests;
    
    if (category) {
      filteredTests = filteredTests.filter(test => 
        test.category && test.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (search) {
      filteredTests = filteredTests.filter(test => 
        test.testName.toLowerCase().includes(search.toLowerCase()) ||
        (test.description && test.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTests = filteredTests.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: filteredTests.length,
      totalPages: Math.ceil(filteredTests.length / limit),
      currentPage: parseInt(page),
      data: paginatedTests
    });
  } catch (error) {
    console.error("Get lab tests error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// =======================
// Get Test by ID
// =======================
const getTestById = async (req, res) => {
  try {
    const { testId } = req.params; // This is labId
    
    const lab = await Laboratory.findById(testId)
      .populate('user', 'name phone email');
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab not found'
      });
    }

    // Get first available test
    const firstTest = lab.testsAvailable && lab.testsAvailable.length > 0 
      ? lab.testsAvailable[0] 
      : null;

    if (!firstTest) {
      return res.status(404).json({
        success: false,
        message: 'No tests available in this lab'
      });
    }

    const responseTest = {
      testId: testId, // Use labId as testId
      testName: firstTest.testName,
      category: firstTest.category,
      price: firstTest.price,
      duration: firstTest.duration,
      description: firstTest.description,
      lab: {
        _id: lab._id,
        name: lab.labName,
        phone: lab.phone || lab.user?.phone,
        email: lab.email || lab.user?.email,
        address: lab.address,
        homeCollectionAvailable: lab.homeCollectionAvailable
      }
    };

    res.status(200).json({
      success: true,
      data: responseTest
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
// Book Lab Test
// =======================
const bookLabTest = async (req, res) => {
  try {
    console.log('Booking request body:', req.body);
    
    const {
      testId, // This is labId (6968d7a559fa387def03d774)
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      collectionDate,
      collectionType,
      address,
      notes
    } = req.body;

    console.log('testId:', testId);
    console.log('patientName:', patientName);
    console.log('patientPhone:', patientPhone);
    console.log('collectionDate:', collectionDate);

    // Required fields validation
    if (!testId || !patientName || !patientPhone || !collectionDate) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Lab ID, patient name, phone, and collection date are required'
      });
    }

    if (collectionType === 'home' && !address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required for home collection'
      });
    }

    // Get lab details - testId is labId
    const lab = await Laboratory.findById(testId);
    
    if (!lab) {
      console.log('Lab not found with id:', testId);
      return res.status(400).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    if (!lab.isVerified || !lab.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Laboratory is not available for booking'
      });
    }

    // Get first available test
    if (!lab.testsAvailable || lab.testsAvailable.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No tests available in this laboratory'
      });
    }

    // Use the first test for now
    const test = lab.testsAvailable[0];

    // Check if home collection is available
    if (collectionType === 'home' && !lab.homeCollectionAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Home collection not available for this lab'
      });
    }

    // Generate a simple testId string
    const generatedTestId = `${lab._id}-${test.testName.replace(/\s+/g, '-').toLowerCase()}`;


    console.log(req.user);
    

    // Create appointment
    const appointment = new LabAppointment({
      laboratory: lab._id,
      patient: req.user?._id, // Can be null for guest
      testName: test.testName,
      testId: generatedTestId, // String, not ObjectId
      patientName,
      patientAge: patientAge || null,
      patientGender: patientGender || 'male',
      patientPhone,
      collectionDate: new Date(collectionDate),
      collectionType,
      address: collectionType === 'home' ? address : '',
      notes: notes || '',
      amount: test.price || 0,
      status: 'scheduled',
      paymentStatus: 'pending'
    });

    await appointment.save();

    console.log('Appointment created:', appointment._id);

    res.status(201).json({
      success: true,
      message: 'Test booked successfully',
      data: {
        appointmentId: appointment._id,
        testName: test.testName,
        labName: lab.labName,
        amount: test.price || 0,
        collectionDate: appointment.collectionDate,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Booking error details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
      details: error.errors // Include validation errors
    });
  }
};
// =======================
// Get Available Labs
// =======================
const getAvailableLabs = async (req, res) => {
  try {
    const labs = await Laboratory.find({ 
      isVerified: true,
      isActive: true 
    })
    .populate('user', 'name email phone')
    .select('labName licenseNumber address phone email homeCollectionAvailable testsAvailable')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: labs.length,
      data: labs
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
  getLabTests,
  getTestById,
  bookLabTest,
  getAvailableLabs
};