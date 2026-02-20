const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Laboratory = require('../models/Laboratory');
const Medicine = require('../models/Medicine');





// =======================
// Get Featured Medicines
// =======================
const getFeaturedMedicines = async (req, res) => {
  try {
    const { limit = 6, category } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    
    const medicines = await Medicine.find(query)
      .populate('pharmacy', 'pharmacyName isVerified')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Filter only medicines from verified pharmacies
    const verifiedMedicines = medicines.filter(
      medicine => medicine.pharmacy?.isVerified
    );

    res.status(200).json({
      success: true,
      count: verifiedMedicines.length,
      data: verifiedMedicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Search Medicines
// =======================

const searchMedicines = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (minPrice) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) {
      query.price = query.price || {};
      query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const medicines = await Medicine.find(query)
      .populate('pharmacy', 'pharmacyName isVerified address')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Medicine.countDocuments(query);

    res.status(200).json({
      success: true,
      page: parseInt(page),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      data: medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Medicine Details
// =======================


// Update the getMedicineDetails function:
const getMedicineDetails = async (req, res) => {

// exports.getMedicineDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await Medicine.findById(id)
      .populate('pharmacy', 'pharmacyName licenseNumber phone email address deliveryAvailable deliveryRadius isVerified');

    if (!medicine || !medicine.isActive) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    // Don't require pharmacy verification for public viewing
    // Let the frontend handle the verification status display
    res.status(200).json({
      success: true,
      data: {
        ...medicine.toObject(),
        pharmacyVerified: medicine.pharmacy?.isVerified || false
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const getMedicineDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const medicine = await Medicine.findById(id)
//       .populate('pharmacy', 'pharmacyName licenseNumber phone email address deliveryAvailable deliveryRadius');

//     if (!medicine || !medicine.isActive) {
//       return res.status(404).json({ success: false, message: 'Medicine not found' });
//     }

//     if (!medicine.pharmacy.isVerified) {
//       return res.status(403).json({ success: false, message: 'Pharmacy not verified' });
//     }

//     res.status(200).json({
//       success: true,
//       data: medicine
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// =======================
// Get Medicine Categories
// =======================
const getMedicineCategories = async (req, res) => {

  try {
    const categories = await Medicine.distinct('category', { isActive: true });
    
    res.status(200).json({
      success: true,
      data: categories.filter(cat => cat).sort()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// =======================
// Get Featured Doctors (for homepage)
// =======================
const getFeaturedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ 
      isVerified: true, 
      isActive: true 
    })
    .populate('user', 'name profilePicture email phone')
    .sort({ rating: -1 })
    .limit(6);

    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      userId: doctor.user?._id,
      name: doctor.user?.name || 'Doctor',
      profilePicture: doctor.user?.profilePicture,
      specialization: doctor.specialization,
      experience: doctor.experience,
      rating: doctor.rating.average,
      reviews: doctor.rating.count,
      consultationFee: doctor.consultationFee,
      hospital: doctor.hospital?.name,
      city: doctor.hospital?.address?.city || doctor.user?.address?.city,
      availability: doctor.availability
    }));

    res.status(200).json({
      success: true,
      count: formattedDoctors.length,
      data: formattedDoctors
    });
  } catch (error) {
    console.error("Get featured doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// =======================
// Get All Doctors (for doctors page)
// =======================
const getAllDoctors = async (req, res) => {
  try {
    const { 
      specialization, 
      city, 
      minExperience, 
      maxFee,
      videoConsultationAvailable,
      page = 1,
      limit = 12 
    } = req.query;

    let query = { isVerified: true, isActive: true };

    // Filters
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (city) {
      query['hospital.address.city'] = { $regex: city, $options: 'i' };
    }
    if (minExperience) {
      query.experience = { $gte: parseInt(minExperience) };
    }
    if (maxFee) {
      query.consultationFee = { $lte: parseFloat(maxFee) };
    }
 
     if (videoConsultationAvailable === 'true') {
      query.videoConsultationAvailable = true;
    } else if (videoConsultationAvailable === 'false') {
      query.videoConsultationAvailable = false;
    }


    const skip = (page - 1) * limit;

    const doctors = await Doctor.find(query)
      .populate('user', 'name profilePicture email phone address')
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Doctor.countDocuments(query);

    const formattedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      userId: doctor.user?._id,
      name: doctor.user?.name || 'Doctor',
      profilePicture: doctor.user?.profilePicture,
      email: doctor.user?.email,
      phone: doctor.user?.phone,
      specialization: doctor.specialization,
      experience: doctor.experience,
      rating: doctor.rating.average,
      reviews: doctor.rating.count,
      consultationFee: doctor.consultationFee,
      followUpFee: doctor.followUpFee,
      bio: doctor.bio,
      hospital: doctor.hospital,
      services: doctor.services,
      qualifications: doctor.qualifications,
      availability: doctor.availability,
      address: doctor.user?.address,
      videoConsultationAvailable: doctor.videoConsultationAvailable || false
    }));

    res.status(200).json({
      success: true,
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: formattedDoctors
    });
  } catch (error) {
    console.error("Get all doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
// const getAllDoctors = async (req, res) => {
//   try {
//     const { 
//       specialization, 
//       city, 
//       minExperience, 
//       maxFee,
//       videoConsultationAvailable,
//       page = 1,
//       limit = 12 
//     } = req.query;

//     let query = { isVerified: true, isActive: true };

//     // Filters
//     if (specialization) {
//       query.specialization = { $regex: specialization, $options: 'i' };
//     }

//     if (city) {
//       query['hospital.address.city'] = { $regex: city, $options: 'i' };
//     }
//     if (minExperience) {
//       query.experience = { $gte: parseInt(minExperience) };
//     }
//     if (maxFee) {
//       query.consultationFee = { $lte: parseFloat(maxFee) };
//     }
//     if (videoConsultationAvailable) {
//       query.videoConsultationAvailable = videoConsultationAvailable;
//     }


//     const skip = (page - 1) * limit;

//     const doctors = await Doctor.find(query)
//       .populate('user', 'name profilePicture email phone address')
//       .sort({ 'rating.average': -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Doctor.countDocuments(query);

//     const formattedDoctors = doctors.map(doctor => ({
//       _id: doctor._id,
//       userId: doctor.user?._id,
//       name: doctor.user?.name || 'Doctor',
//       profilePicture: doctor.user?.profilePicture,
//       email: doctor.user?.email,
//       phone: doctor.user?.phone,
//       specialization: doctor.specialization,
//       experience: doctor.experience,
//       rating: doctor.rating.average,
//       reviews: doctor.rating.count,
//       consultationFee: doctor.consultationFee,
//       followUpFee: doctor.followUpFee,
//       bio: doctor.bio,
//       hospital: doctor.hospital,
//       services: doctor.services,
//       qualifications: doctor.qualifications,
//       availability: doctor.availability,
//       videoConsultationAvailable:doctor.videoConsultationAvailable,
//       address: doctor.user?.address
//     }));

//     res.status(200).json({
//       success: true,
//       count: total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page),
//       data: formattedDoctors
//     });
//   } catch (error) {
//     console.error("Get all doctors error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message
//     });
//   }
// };

// =======================
// Get Doctor by ID
// =======================
// =======================
// Get Single Doctor by ID
// =======================
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id)
      .populate('user', 'name profilePicture email phone address')
      .populate('qualifications')
      .populate('availability');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if doctor is verified
    if (!doctor.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Doctor is not verified'
      });
    }

    const doctorData = {
      _id: doctor._id,
      name: doctor.user?.name,
      profilePicture: doctor.user?.profilePicture,
      specialization: doctor.specialization,
      experience: doctor.experience,
      rating: doctor.rating.average,
      reviews: doctor.rating.count,
      consultationFee: doctor.consultationFee,
      followUpFee: doctor.followUpFee,
      bio: doctor.bio,
      licenseNumber: doctor.licenseNumber,
      hospital: doctor.hospital,
      services: doctor.services,
      qualifications: doctor.qualifications,
      availability: doctor.availability,
      videoConsultationAvailable: doctor.videoConsultationAvailable || false,
      address: doctor.user?.address
    };

    res.status(200).json({
      success: true,
      data: doctorData
    });

  } catch (error) {
    console.error("Get doctor by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// =======================
// Get All Specialties
// =======================
const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.aggregate([
      { $match: { isVerified: true, isActive: true } },
      { $group: { 
        _id: '$specialization', 
        count: { $sum: 1 },
        averageFee: { $avg: '$consultationFee' },
        averageRating: { $avg: '$rating.average' }
      }},
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: specialties.length,
      data: specialties
    });
  } catch (error) {
    console.error("Get specialties error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// =======================
// Get Pharmacy Products (for homepage)
// =======================
const getPharmacyProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const products = await Medicine.find(query)
      .populate('pharmacy', 'pharmacyName address deliveryAvailable')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Medicine.countDocuments(query);

    res.status(200).json({
      success: true,
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: products
    });
  } catch (error) {
    console.error("Get pharmacy products error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// =======================
// Get Lab Tests (for homepage)
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
        lab.testsAvailable.forEach(test => {
          allTests.push({
            testId: test._id || Math.random().toString(36).substr(2, 9),
            testName: test.testName,
            category: test.category,
            price: test.price,
            duration: test.duration,
            description: test.description,
            lab: {
              _id: lab._id,
              name: lab.labName,
              phone: lab.phone || lab.user?.phone,
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
        test.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (search) {
      filteredTests = filteredTests.filter(test => 
        test.testName.toLowerCase().includes(search.toLowerCase()) ||
        test.description.toLowerCase().includes(search.toLowerCase())
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
// Search Doctors
// =======================
const searchDoctors = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const doctors = await Doctor.find({
      $or: [
        { specialization: { $regex: q, $options: 'i' } },
        { 'hospital.name': { $regex: q, $options: 'i' } },
        { 'hospital.address.city': { $regex: q, $options: 'i' } },
        { 'hospital.address.state': { $regex: q, $options: 'i' } }
      ],
      isVerified: true,
      isActive: true
    })
    .populate('user', 'name profilePicture')
    .limit(10);

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error("Search doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// =======================
// Get Testimonials
// =======================
const getTestimonials = async (req, res) => {
  try {
    // Mock testimonials for now - can connect to Review model later
    const testimonials = [
      {
        name: 'Robert Johnson',
        location: 'New York',
        rating: 5,
        comment: 'The video consultation feature saved me so much time. Dr. Smith was very professional and helpful.',
        date: '2024-01-15'
      },
      {
        name: 'Sarah Williams',
        location: 'California',
        rating: 5,
        comment: 'Found the perfect specialist for my condition. The booking process was seamless and quick.',
        date: '2024-02-20'
      },
      {
        name: 'Michael Brown',
        location: 'Texas',
        rating: 5,
        comment: 'The AI symptom checker accurately recommended the right type of doctor for my symptoms.',
        date: '2024-03-10'
      }
    ];

    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error("Get testimonials error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

module.exports = {
  getFeaturedDoctors,
  getAllDoctors,
  getDoctorById,
  getAllSpecialties,
  getPharmacyProducts,
  getLabTests,
  searchDoctors,
  getTestimonials,
  getMedicineCategories,
  getFeaturedMedicines,
  searchMedicines,
  getMedicineDetails,
  getMedicineCategories

};