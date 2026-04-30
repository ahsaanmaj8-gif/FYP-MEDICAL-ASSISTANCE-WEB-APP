// const User = require('../models/User');
// const Doctor = require('../Models/Doctor');
// const Pharmacy = require('../Models/Pharmacy');
// const Laboratory = require('../Models/Laboratory');


import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Pharmacy from "../models/Pharmacy.js";
import Laboratory from "../models/Laboratory.js";


// =======================
// Get Dashboard Statistics
// =======================
// const getDashboardStats = async (req, res) => {
//   try {
//     // Count users (patients)
//     const totalUsers = await User.countDocuments({ role: 'user' });
    
//     // Count only VERIFIED providers from their respective models
//     const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
//     const verifiedPharmacies = await Pharmacy.countDocuments({ isVerified: true });
//     const verifiedLaboratories = await Laboratory.countDocuments({ isVerified: true });
    
//     // Count total providers (both verified and pending)
//     const totalDoctors = await Doctor.countDocuments({});
//     const totalPharmacies = await Pharmacy.countDocuments({});
//     const totalLaboratories = await Laboratory.countDocuments({});

//     // Count pending providers
//     const pendingDoctors = await Doctor.countDocuments({ isVerified: false });
//     const pendingPharmacies = await Pharmacy.countDocuments({ isVerified: false });
//     const pendingLaboratories = await Laboratory.countDocuments({ isVerified: false });

//     res.status(200).json({
//       success: true,
//       data: {
//         users: totalUsers,
//         doctors: verifiedDoctors, // Only verified doctors
//         pharmacies: verifiedPharmacies, // Only verified pharmacies
//         laboratories: verifiedLaboratories, // Only verified laboratories
//         totalProviders: totalDoctors + totalPharmacies + totalLaboratories, // All providers
//         verifiedProviders: verifiedDoctors + verifiedPharmacies + verifiedLaboratories, // Only verified
//         pending: {
//           doctors: pendingDoctors,
//           pharmacies: pendingPharmacies,
//           laboratories: pendingLaboratories
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Dashboard stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard statistics',
//       error: error.message
//     });
//   }
// };




// const getDashboardStats = async (req, res) => {
//   try {
//     // Count users (patients)
//     const totalUsers = await User.countDocuments({ role: 'user' });
    
//     // Count only VERIFIED providers
//     const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
//     const verifiedPharmacies = await Pharmacy.countDocuments({ isVerified: true });
//     const verifiedLaboratories = await Laboratory.countDocuments({ isVerified: true });
    
//     // Count total providers (all statuses)
//     const totalDoctors = await Doctor.countDocuments({});
//     const totalPharmacies = await Pharmacy.countDocuments({});
//     const totalLaboratories = await Laboratory.countDocuments({});

//     // ✅ CORRECT: Count ONLY ACTUAL PENDING (not rejected)
//     const pendingDoctors = await Doctor.countDocuments({ 
//       isVerified: false, 
//       rejectedAt: null // NOT rejected
//     });
//     const pendingPharmacies = await Pharmacy.countDocuments({ 
//       isVerified: false, 
//       rejectedAt: null // NOT rejected
//     });
//     const pendingLaboratories = await Laboratory.countDocuments({ 
//       isVerified: false, 
//       rejectedAt: null // NOT rejected
//     });

//     // Count REJECTED providers (for reference)
//     const rejectedDoctors = await Doctor.countDocuments({ rejectedAt: { $ne: null } });
//     const rejectedPharmacies = await Pharmacy.countDocuments({ rejectedAt: { $ne: null } });
//     const rejectedLaboratories = await Laboratory.countDocuments({ rejectedAt: { $ne: null } });

//     res.status(200).json({
//       success: true,
//       data: {
//         users: totalUsers,
//         doctors: verifiedDoctors, // Only verified doctors
//         pharmacies: verifiedPharmacies, // Only verified pharmacies
//         laboratories: verifiedLaboratories, // Only verified laboratories
//         totalProviders: totalDoctors + totalPharmacies + totalLaboratories, // All providers
//         verifiedProviders: verifiedDoctors + verifiedPharmacies + verifiedLaboratories, // Only verified
        
//         // ✅ CORRECT: Pending = Not verified AND Not rejected
//         pending: {
//           doctors: pendingDoctors,
//           pharmacies: pendingPharmacies,
//           laboratories: pendingLaboratories,
//           total: pendingDoctors + pendingPharmacies + pendingLaboratories // ✅ Add totalPending
//         },
        
//         // ✅ Optional: Add rejected counts if needed
//         rejected: {
//           doctors: rejectedDoctors,
//           pharmacies: rejectedPharmacies,
//           laboratories: rejectedLaboratories,
//           total: rejectedDoctors + rejectedPharmacies + rejectedLaboratories
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Dashboard stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard statistics',
//       error: error.message
//     });
//   }
// };

const getDashboardStats = async (req, res) => {
  try {
    // Count users (patients)
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Count only VERIFIED providers
    const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
    const verifiedPharmacies = await Pharmacy.countDocuments({ isVerified: true });
    const verifiedLaboratories = await Laboratory.countDocuments({ isVerified: true });
    
    // Count total providers (all statuses)
    const totalDoctors = await Doctor.countDocuments({});
    const totalPharmacies = await Pharmacy.countDocuments({});
    const totalLaboratories = await Laboratory.countDocuments({});

    // ✅ CORRECT: Count ONLY ACTUAL PENDING (not rejected)
    const pendingDoctors = await Doctor.countDocuments({ 
      isVerified: false, 
      rejectedAt: null // NOT rejected
    });
    const pendingPharmacies = await Pharmacy.countDocuments({ 
      isVerified: false, 
      rejectedAt: null // NOT rejected
    });
    const pendingLaboratories = await Laboratory.countDocuments({ 
      isVerified: false, 
      rejectedAt: null // NOT rejected
    });

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        doctors: verifiedDoctors,
        pharmacies: verifiedPharmacies,
        laboratories: verifiedLaboratories,
        totalProviders: totalDoctors + totalPharmacies + totalLaboratories,
        verifiedProviders: verifiedDoctors + verifiedPharmacies + verifiedLaboratories,
        
        // ✅ CORRECT PENDING COUNTS (not including rejected)
        pending: {
          doctors: pendingDoctors,
          pharmacies: pendingPharmacies,
          laboratories: pendingLaboratories
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// =======================
// Doctor Management
// =======================
// const getDoctors = async (req, res) => {
//   try {
//     const { status } = req.query; // 'pending', 'verified', 'rejected'

//     let query = {};
//     if (status === 'pending') {
//       query.isVerified = false;
//     } else if (status === 'verified') {
//       query.isVerified = true;
//     }

//     const doctors = await Doctor.find(query)
//       .populate('user', 'name email phone profilePicture')
//       .sort({ createdAt: -1 });

//     const formattedDoctors = doctors.map(doctor => ({
//       id: doctor._id,
//       userId: doctor.user._id,
//       name: doctor.user.name,
//       email: doctor.user.email,
//       phone: doctor.user.phone,
//       profilePicture: doctor.user.profilePicture,
//       specialization: doctor.specialization,
//       experience: `${doctor.experience} years`,
//       licenseNumber: doctor.licenseNumber,
//       consultationFee: doctor.consultationFee,
//       qualifications: doctor.qualifications,
//       bio: doctor.bio,
//       isVerified: doctor.isVerified,
//       appliedDate: doctor.createdAt,
//       certificates: doctor.certificates
//     }));

//     res.status(200).json({
//       success: true,
//       data: formattedDoctors
//     });
//   } catch (error) {
//     console.error('Get doctors error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching doctors',
//       error: error.message
//     });
//   }
// };

const verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { 
        isVerified: true,
        isActive: true
      },
      { new: true }
    ).populate('user');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Also update user verification status
    await User.findByIdAndUpdate(doctor.user._id, {
      isVerified: true
    });

    res.status(200).json({
      success: true,
      message: 'Doctor verified successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Verify doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying doctor',
      error: error.message
    });
  }
};

// const rejectDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;

//     const doctor = await Doctor.findByIdAndUpdate(
//       id,
//       { 
//         isVerified: false,
//         isActive: false,
//         rejectionReason: reason
//       },
//       { new: true }
//     );

//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: 'Doctor not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Doctor rejected successfully',
//       data: doctor
//     });
//   } catch (error) {
//     console.error('Reject doctor error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error rejecting doctor',
//       error: error.message
//     });
//   }
// };

// =======================
// Pharmacy Management
// =======================
// const getPharmacies = async (req, res) => {
//   try {
//     const { status } = req.query;

//     let query = {};
//     if (status === 'pending') {
//       query.isVerified = false;
//     } else if (status === 'verified') {
//       query.isVerified = true;
//     }

//     const pharmacies = await Pharmacy.find(query)
//       .populate('user', 'name email phone profilePicture')
//       .sort({ createdAt: -1 });

//     const formattedPharmacies = pharmacies.map(pharmacy => ({
//       id: pharmacy._id,
//       userId: pharmacy.user._id,
//       name: pharmacy.pharmacyName,
//       owner: pharmacy.user.name,
//       email: pharmacy.user.email,
//       phone: pharmacy.user.phone,
//       profilePicture: pharmacy.user.profilePicture,
//       licenseNumber: pharmacy.licenseNumber,
//       pharmacyPhone: pharmacy.phone,
//       pharmacyEmail: pharmacy.email,
//       address: pharmacy.address,
//       deliveryAvailable: pharmacy.deliveryAvailable,
//       deliveryRadius: pharmacy.deliveryRadius,
//       businessHours: pharmacy.businessHours,
//       isVerified: pharmacy.isVerified,
//       appliedDate: pharmacy.createdAt
//     }));

//     res.status(200).json({
//       success: true,
//       data: formattedPharmacies
//     });
//   } catch (error) {
//     console.error('Get pharmacies error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching pharmacies',
//       error: error.message
//     });
//   }
// };






// const getPharmacies = async (req, res) => {
//   try {
//     const { status } = req.query;

//     let query = {};
//     if (status === 'pending') {
//       query.isVerified = false;
//       query.rejectionReason = ""; // ✅ Empty string means not rejected
//     } else if (status === 'verified') {
//       query.isVerified = true;
//     } else if (status === 'rejected') {
//       query.rejectionReason = { $ne: "" }; // ✅ Has rejection reason (not empty)
//     }

//     const pharmacies = await Pharmacy.find(query)
//       .populate('user', 'name email phone profilePicture')
//       .sort({ createdAt: -1 });

//     const formattedPharmacies = pharmacies.map(pharmacy => ({
//       id: pharmacy._id,
//       userId: pharmacy.user._id,
//       name: pharmacy.pharmacyName,
//       owner: pharmacy.user.name,
//       email: pharmacy.user.email,
//       phone: pharmacy.user.phone,
//       profilePicture: pharmacy.user.profilePicture,
//       licenseNumber: pharmacy.licenseNumber,
//       pharmacyPhone: pharmacy.phone,
//       pharmacyEmail: pharmacy.email,
//       address: pharmacy.address,
//       deliveryAvailable: pharmacy.deliveryAvailable,
//       deliveryRadius: pharmacy.deliveryRadius,
//       businessHours: pharmacy.businessHours,
//       isVerified: pharmacy.isVerified,
//       appliedDate: pharmacy.createdAt,
//       rejectionReason: pharmacy.rejectionReason, // ✅ ADD THIS
//       rejectedAt: pharmacy.rejectedAt // ✅ ADD THIS
//     }));

//     res.status(200).json({
//       success: true,
//       data: formattedPharmacies
//     });
//   } catch (error) {
//     console.error('Get pharmacies error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching pharmacies',
//       error: error.message
//     });
//   }
// };

// =======================
// Get All Pharmacies (Admin)
// =======================
const getPharmacies = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status === 'pending') {
      query.isVerified = false;
    } else if (status === 'verified') {
      query.isVerified = true;
    }

    const pharmacies = await Pharmacy.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    // ✅ FIX: Check if user exists
    const formattedPharmacies = pharmacies.map(pharmacy => {
      if (!pharmacy || !pharmacy.user) {
        console.log('⚠️ Skipping pharmacy with null user:', pharmacy?._id);
        return null;
      }
      
      return {
        _id: pharmacy._id,
        userId: pharmacy.user._id,
        name: pharmacy.user.name || 'Unknown',
        email: pharmacy.user.email || '',
        phone: pharmacy.user.phone || '',
        pharmacyName: pharmacy.pharmacyName || '',
        licenseNumber: pharmacy.licenseNumber || '',
        address: pharmacy.address || {},
        deliveryAvailable: pharmacy.deliveryAvailable || false,
        isVerified: pharmacy.isVerified || false,
        rejectionReason: pharmacy.rejectionReason || '',
        createdAt: pharmacy.createdAt
      };
    }).filter(pharmacy => pharmacy !== null);

    res.status(200).json({
      success: true,
      count: formattedPharmacies.length,
      data: formattedPharmacies
    });

  } catch (error) {
    console.error("Get pharmacies error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pharmacies",
      error: error.message
    });
  }
};


const verifyPharmacy = async (req, res) => {
  try {
    const { id } = req.params;

    const pharmacy = await Pharmacy.findByIdAndUpdate(
      id,
      { 
        isVerified: true,
        isActive: true,
        verifiedAt: new Date() // ✅ ADD VERIFICATION TIMESTAMP
      },
      { new: true }
    ).populate('user');

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    await User.findByIdAndUpdate(pharmacy.user._id, {
      isVerified: true
    });

    res.status(200).json({
      success: true,
      message: 'Pharmacy verified successfully',
      data: pharmacy
    });
  } catch (error) {
    console.error('Verify pharmacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying pharmacy',
      error: error.message
    });
  }
};

// const rejectPharmacy = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;

//     const pharmacy = await Pharmacy.findByIdAndUpdate(
//       id,
//       { 
//         isVerified: false,
//         isActive: false,
//         rejectionReason: reason
//       },
//       { new: true }
//     );

//     if (!pharmacy) {
//       return res.status(404).json({
//         success: false,
//         message: 'Pharmacy not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Pharmacy rejected successfully',
//       data: pharmacy
//     });
//   } catch (error) {
//     console.error('Reject pharmacy error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error rejecting pharmacy',
//       error: error.message
//     });
//   }
// };

// =======================
// Laboratory Management
// =======================
// const getLaboratories = async (req, res) => {
//   try {
//     const { status } = req.query;

//     let query = {};
//     if (status === 'pending') {
//       query.isVerified = false;
//       query.rejectionReason = ""; // ✅ Empty string means not rejected
//     } else if (status === 'verified') {
//       query.isVerified = true;
//     } else if (status === 'rejected') {
//       query.rejectionReason = { $ne: "" }; // ✅ Has rejection reason
//     }

//     const laboratories = await Laboratory.find(query)
//       .populate('user', 'name email phone profilePicture')
//       .sort({ createdAt: -1 });

//     const formattedLabs = laboratories.map(lab => ({
//       id: lab._id,
//       userId: lab.user._id,
//       name: lab.labName,
//       owner: lab.user.name,
//       email: lab.user.email,
//       phone: lab.user.phone,
//       profilePicture: lab.user.profilePicture,
//       licenseNumber: lab.licenseNumber,
//       labPhone: lab.phone,
//       labEmail: lab.email,
//       address: lab.address,
//       homeCollectionAvailable: lab.homeCollectionAvailable,
//       testsAvailable: lab.testsAvailable,
//       businessHours: lab.businessHours,
//       isVerified: lab.isVerified,
//       appliedDate: lab.createdAt,
//       rejectionReason: lab.rejectionReason, // ✅ ADD THIS
//       rejectedAt: lab.rejectedAt // ✅ ADD THIS
//     }));

//     res.status(200).json({
//       success: true,
//       data: formattedLabs
//     });
//   } catch (error) {
//     console.error('Get laboratories error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching laboratories',
//       error: error.message
//     });
//   }
// };



// =======================
// Get All Laboratories (Admin)
// =======================
const getLaboratories = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status === 'pending') {
      query.isVerified = false;
    } else if (status === 'verified') {
      query.isVerified = true;
    }

    const laboratories = await Laboratory.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    // ✅ FIX: Check if user exists
    const formattedLaboratories = laboratories.map(lab => {
      if (!lab || !lab.user) {
        console.log('⚠️ Skipping laboratory with null user:', lab?._id);
        return null;
      }
      
      return {
        _id: lab._id,
        userId: lab.user._id,
        name: lab.user.name || 'Unknown',
        email: lab.user.email || '',
        phone: lab.user.phone || '',
        labName: lab.labName || '',
        licenseNumber: lab.licenseNumber || '',
        address: lab.address || {},
        homeCollectionAvailable: lab.homeCollectionAvailable || false,
        isVerified: lab.isVerified || false,
        rejectionReason: lab.rejectionReason || '',
        createdAt: lab.createdAt
      };
    }).filter(lab => lab !== null);

    res.status(200).json({
      success: true,
      count: formattedLaboratories.length,
      data: formattedLaboratories
    });

  } catch (error) {
    console.error("Get laboratories error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching laboratories",
      error: error.message
    });
  }
};



const verifyLaboratory = async (req, res) => {
  try {
    const { id } = req.params;

    const laboratory = await Laboratory.findByIdAndUpdate(
      id,
      { 
        isVerified: true,
        isActive: true,
        verifiedAt: new Date() // ✅ ADD VERIFICATION TIMESTAMP
      },
      { new: true }
    ).populate('user');

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    await User.findByIdAndUpdate(laboratory.user._id, {
      isVerified: true
    });

    res.status(200).json({
      success: true,
      message: 'Laboratory verified successfully',
      data: laboratory
    });
  } catch (error) {
    console.error('Verify laboratory error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying laboratory',
      error: error.message
    });
  }
};

// const rejectLaboratory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reason } = req.body;

//     const laboratory = await Laboratory.findByIdAndUpdate(
//       id,
//       { 
//         isVerified: false,
//         isActive: false,
//         rejectionReason: reason
//       },
//       { new: true }
//     );

//     if (!laboratory) {
//       return res.status(404).json({
//         success: false,
//         message: 'Laboratory not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Laboratory rejected successfully',
//       data: laboratory
//     });
//   } catch (error) {
//     console.error('Reject laboratory error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error rejecting laboratory',
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   getDashboardStats,
//   getDoctors,
//   verifyDoctor,
//   rejectDoctor,
//   getPharmacies,
//   verifyPharmacy,
//   rejectPharmacy,
//   getLaboratories,
//   verifyLaboratory,
//   rejectLaboratory
// };















// In the rejectDoctor function:
const rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { 
        isVerified: false,
        isActive: false,
        rejectionReason: reason,
        rejectedAt: new Date() // ✅ Set rejection timestamp
      },
      { new: true }
    ).populate('user');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Also update user verification status
    await User.findByIdAndUpdate(doctor.user._id, {
      isVerified: false
    });

    res.status(200).json({
      success: true,
      message: 'Doctor rejected successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Reject doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting doctor',
      error: error.message
    });
  }
};

// In the getDoctors function - update to include rejected status:
// const getDoctors = async (req, res) => {
//   try {
//     const { status } = req.query; // 'pending', 'verified', 'rejected'

//     let query = {};
//     if (status === 'pending') {
//       query.isVerified = false;
//       query.rejectionReason = ""; // Empty string means not rejected
//     } else if (status === 'verified') {
//       query.isVerified = true;
//     } else if (status === 'rejected') {
//       query.rejectionReason = { $ne: "" }; // Has rejection reason (not empty)
//     }

//     const doctors = await Doctor.find(query)
//       .populate('user', 'name email phone profilePicture')
//       .sort({ createdAt: -1 });

//     const formattedDoctors = doctors.map(doctor => ({
//       id: doctor._id,
//       userId: doctor.user._id,
//       name: doctor.user.name,
//       email: doctor.user.email,
//       phone: doctor.user.phone,
//       profilePicture: doctor.user.profilePicture,
//       specialization: doctor.specialization,
//       experience: `${doctor.experience} years`,
//       licenseNumber: doctor.licenseNumber,
//       consultationFee: doctor.consultationFee,
//       qualifications: doctor.qualifications,
//       bio: doctor.bio,
//       isVerified: doctor.isVerified,
//       appliedDate: doctor.createdAt,
//       certificates: doctor.certificates,
//       rejectionReason: doctor.rejectionReason,
//       rejectedAt: doctor.rejectedAt
//     }));

//     res.status(200).json({
//       success: true,
//       data: formattedDoctors
//     });
//   } catch (error) {
//     console.error('Get doctors error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching doctors',
//       error: error.message
//     });
//   }
// };

// =======================
// Get All Doctors (Admin)
// =======================
const getDoctors = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status === 'pending') {
      query.isVerified = false;
    } else if (status === 'verified') {
      query.isVerified = true;
    }

    const doctors = await Doctor.find(query)
      .populate('user', 'name email phone profilePicture')
      .sort({ createdAt: -1 });

    // ✅ FIX: Check if user exists before accessing properties
    const formattedDoctors = doctors.map(doctor => {
      // Skip if doctor or user is null
      if (!doctor || !doctor.user) {
        console.log('⚠️ Skipping doctor with null user:', doctor?._id);
        return null;
      }
      
      return {
        _id: doctor._id,
        userId: doctor.user._id,
        name: doctor.user.name || 'Unknown',
        email: doctor.user.email || '',
        phone: doctor.user.phone || '',
        profilePicture: doctor.user.profilePicture || '',
        specialization: doctor.specialization || '',
        experience: doctor.experience || 0,
        licenseNumber: doctor.licenseNumber || '',
        consultationFee: doctor.consultationFee || 0,
        isVerified: doctor.isVerified || false,
        rejectionReason: doctor.rejectionReason || '',
        createdAt: doctor.createdAt,
        rejectionReason: doctor.rejectionReason || '',
        rejectedAt: doctor.rejectedAt || null,
        verifiedAt: doctor.verifiedAt || null
      };
    }).filter(doctor => doctor !== null); // Remove null entries

    res.status(200).json({
      success: true,
      count: formattedDoctors.length,
      data: formattedDoctors
    });

  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message
    });
  }
};

// Do the same for Pharmacy and Laboratory reject functions
const rejectPharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const pharmacy = await Pharmacy.findByIdAndUpdate(
      id,
      { 
        isVerified: false,
        isActive: false,
        rejectionReason: reason,
        rejectedAt: new Date() // ✅ SET REJECTION TIMESTAMP
      },
      { new: true }
    ).populate('user');

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    await User.findByIdAndUpdate(pharmacy.user._id, {
      isVerified: false
    });

    res.status(200).json({
      success: true,
      message: 'Pharmacy rejected successfully',
      data: pharmacy
    });
  } catch (error) {
    console.error('Reject pharmacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting pharmacy',
      error: error.message
    });
  }
};

const rejectLaboratory = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const laboratory = await Laboratory.findByIdAndUpdate(
      id,
      { 
        isVerified: false,
        isActive: false,
        rejectionReason: reason,
        rejectedAt: new Date()
      },
      { new: true }
    ).populate('user');

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: 'Laboratory not found'
      });
    }

    await User.findByIdAndUpdate(laboratory.user._id, {
      isVerified: false
    });

    res.status(200).json({
      success: true,
      message: 'Laboratory rejected successfully',
      data: laboratory
    });
  } catch (error) {
    console.error('Reject laboratory error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting laboratory',
      error: error.message
    });
  }
};

export {
  getDashboardStats,
  getDoctors,
  verifyDoctor,
  rejectDoctor,
  getPharmacies,
  verifyPharmacy,
  rejectPharmacy,
  getLaboratories,
  verifyLaboratory,
  rejectLaboratory
};