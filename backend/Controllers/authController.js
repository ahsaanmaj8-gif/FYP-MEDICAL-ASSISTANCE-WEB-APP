// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const User = require("../models/User");
// const Doctor = require("../models/Doctor");
// const Pharmacy = require("../models/Pharmacy");
// const Laboratory = require("../models/Laboratory");

// import { sendEmail } from "../Controllers/sendEmail.js"; // adjust path

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Pharmacy from "../models/Pharmacy.js";
import Laboratory from "../models/Laboratory.js";

import { sendEmail } from "../Controllers/sendEmail.js";
// const sendEmail = require("../Controllers/sendEmail")

// =======================
// User Registration (All Roles)
// =======================
// const register = async (req, res) => {
//   try {
//     const {
//       name, email, password, phone, dateOfBirth, gender,

//     //   profilePicture,

//       role,

//       address,
//       bloodGroup, allergies, medicalHistory,
//       doctorInfo, pharmacyInfo, laboratoryInfo
//     } = req.body;

//     // const profilePicture = req.file?.path || req.file?.filename;

//     console.log(req.file?.path || req.file?.filename);

//     // Required fields validation
//     if (!name || !email || !password || !phone || !role) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email, password, phone, and role are required.",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "You are already registered.",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user data
//     const userData = {
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       dateOfBirth: dateOfBirth || null,
//       gender: gender || '',
//       profilePicture: req.file ? req.file.filename : "",
//     //   profilePicture: profilePicture || '',
//       role,
//       address: address || {},
//       bloodGroup: bloodGroup || '',
//       allergies: allergies || [],
//       medicalHistory: medicalHistory || [],
//       isVerified: role === 'user', // Auto-verify patients
//       isActive: true
//     };

//     // Create user
//     const newUser = await User.create(userData);

//     // Create role-specific document
//     if (role === 'doctor' && doctorInfo) {
//       // Validate required doctor fields
//       if (!doctorInfo.specialization || !doctorInfo.experience || !doctorInfo.licenseNumber || !doctorInfo.consultationFee) {
//         await User.findByIdAndDelete(newUser._id);
//         return res.status(400).json({
//           success: false,
//           message: "Please provide all required doctor information.",
//         });
//       }

//       const doctorData = {
//         user: newUser._id,
//         specialization: doctorInfo.specialization,
//         qualifications: doctorInfo.qualifications || [],
//         experience: parseInt(doctorInfo.experience),
//         licenseNumber: doctorInfo.licenseNumber,
//         consultationFee: parseFloat(doctorInfo.consultationFee),
//         followUpFee: parseFloat(doctorInfo.followUpFee) || 0,
//         bio: doctorInfo.bio || '',
//         hospital: doctorInfo.hospital || {},
//         availability: doctorInfo.availability || [],
//         services: doctorInfo.services || [],
//         certificates: doctorInfo.certificates || [],
//         isVerified: false,
//         isActive: true
//       };

//       await Doctor.create(doctorData);
//     }

//     if (role === 'pharmacy' && pharmacyInfo) {
//       if (!pharmacyInfo.pharmacyName || !pharmacyInfo.licenseNumber) {
//         await User.findByIdAndDelete(newUser._id);
//         return res.status(400).json({
//           success: false,
//           message: "Please provide pharmacy name and license number.",
//         });
//       }

//       const pharmacyData = {
//         user: newUser._id,
//         pharmacyName: pharmacyInfo.pharmacyName,
//         licenseNumber: pharmacyInfo.licenseNumber,
//         phone: pharmacyInfo.phone || '',
//         email: pharmacyInfo.email || '',
//         address: pharmacyInfo.address || {},
//         businessHours: pharmacyInfo.businessHours || [],
//         deliveryAvailable: pharmacyInfo.deliveryAvailable || false,
//         deliveryRadius: pharmacyInfo.deliveryRadius || 0,
//         isVerified: false,
//         isActive: true
//       };

//       await Pharmacy.create(pharmacyData);
//     }

//     if (role === 'laboratory' && laboratoryInfo) {
//       if (!laboratoryInfo.labName || !laboratoryInfo.licenseNumber) {
//         await User.findByIdAndDelete(newUser._id);
//         return res.status(400).json({
//           success: false,
//           message: "Please provide laboratory name and license number.",
//         });
//       }

//       const laboratoryData = {
//         user: newUser._id,
//         labName: laboratoryInfo.labName,
//         licenseNumber: laboratoryInfo.licenseNumber,
//         phone: laboratoryInfo.phone || '',
//         email: laboratoryInfo.email || '',
//         address: laboratoryInfo.address || {},
//         businessHours: laboratoryInfo.businessHours || [],
//         homeCollectionAvailable: laboratoryInfo.homeCollectionAvailable || false,
//         testsAvailable: laboratoryInfo.testsAvailable || [],
//         isVerified: false,
//         isActive: true
//       };

//       await Laboratory.create(laboratoryData);
//     }

//     // Response message based on role
//     let message = '';
//     if (role === 'user') {
//       message = "Patient account created successfully!";
//     } else {
//       message = `${role.charAt(0).toUpperCase() + role.slice(1)} account submitted for verification!`;
//     }

//     res.status(201).json({
//       success: true,
//       message,
//       user: {
//         _id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//         isVerified: newUser.isVerified
//       },
//     });

//   } catch (error) {
//     console.error("Signup error:", error);

//     // Handle duplicate key errors
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Email or license number already exists.",
//       });
//     }

//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(', '),
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

const register = async (req, res) => {
  const profilePicture = req.file?.path || req.file?.filename;

  try {
    let {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      role,
      address,
      bloodGroup,
      allergies,
      medicalHistory,
      doctorInfo,
      pharmacyInfo,
      laboratoryInfo,
    } = req.body;

    // Parse JSON fields if sent as strings (FormData sends objects as strings)
    try {
      if (typeof doctorInfo === "string") doctorInfo = JSON.parse(doctorInfo);
      if (typeof address === "string") address = JSON.parse(address);
      if (typeof pharmacyInfo === "string")
        pharmacyInfo = JSON.parse(pharmacyInfo);
      if (typeof laboratoryInfo === "string")
        laboratoryInfo = JSON.parse(laboratoryInfo);

      if (typeof allergies === "string") allergies = JSON.parse(allergies);
      if (typeof medicalHistory === "string")
        medicalHistory = JSON.parse(medicalHistory);
    } catch (err) {
      console.error("JSON parse error:", err);
    }

    // Required fields validation
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, phone, and role are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "You are already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    

    // Base User Fields
    let userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      address: address || {},
      isVerified: role === "user",
      isActive: true,
    };

    //  If user is a PATIENT → Add patient-only fields
    if (role === "user") {
      userData = {
        ...userData,
        dateOfBirth: dateOfBirth || null,
        gender: gender || "",
        profilePicture,
        bloodGroup: bloodGroup || "",
        allergies: allergies || [],
        medicalHistory: medicalHistory || [],
      };
    }

    //  If user is a PHARMACY → Do NOT add gender, bloodGroup, etc.
    if (role === "pharmacy") {
      userData = {
        ...userData,
        profilePicture, // Optional if pharmacy has a profile photo
      };
    }



    if (role === "laboratory") {
  userData = {
    ...userData,
    profilePicture,
  };
}


    const newUser = await User.create(userData);

    // ---- Doctor role ----
    if (role === "doctor" && doctorInfo) {
      // Validate required doctor fields
      if (
        !doctorInfo.specialization ||
        !doctorInfo.experience ||
        !doctorInfo.licenseNumber ||
        !doctorInfo.consultationFee
      ) {
        await User.findByIdAndDelete(newUser._id);
        return res.status(400).json({
          success: false,
          message: "Please provide all required doctor information.",
        });
      }

      const doctorData = {
        user: newUser._id,
        specialization: doctorInfo.specialization,
        qualifications: doctorInfo.qualifications || [],
        experience: parseInt(doctorInfo.experience),
        licenseNumber: doctorInfo.licenseNumber,
        consultationFee: parseFloat(doctorInfo.consultationFee),
        followUpFee: parseFloat(doctorInfo.followUpFee) || 0,
        bio: doctorInfo.bio || "",
        hospital: doctorInfo.hospital || {},
        availability: doctorInfo.availability || [],
        services: doctorInfo.services || [],
        certificates: doctorInfo.certificates || [],


        videoConsultationAvailable:doctorInfo.videoConsultationAvailable || false,


        //  isVerified: false, // ✅ Ensure this is false for new doctors
    // isActive: true,
    rejectionReason: "", // ✅ Initialize as empty string
        isVerified: false,
        isActive: true,
      };

      await Doctor.create(doctorData);

      // Send email to admin
      //   const adminEmail = process.env.ADMIN_EMAIL;
      const htmlMessage = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border-radius: 10px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">🩺 New Doctor Registration</h2>
  <p style="color: #555555; font-size: 16px; line-height: 1.5;">
    A new doctor has submitted their registration and is pending verification. Please review the details below:
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
    <tr style="background-color: #f2f2f2;">
      <td style="padding: 10px; font-weight: bold;">Name</td>
      <td style="padding: 10px;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 10px; font-weight: bold;">Email</td>
      <td style="padding: 10px;">${email}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
      <td style="padding: 10px; font-weight: bold;">Phone</td>
      <td style="padding: 10px;">${phone}</td>
    </tr>
    <tr>
      <td style="padding: 10px; font-weight: bold;">Specialization</td>
      <td style="padding: 10px;">${doctorInfo.specialization}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
      <td style="padding: 10px; font-weight: bold;">License</td>
      <td style="padding: 10px;">${doctorInfo.licenseNumber}</td>
    </tr>
       <tr>
            <td style="padding: 10px; font-weight: bold;">Video Consultation</td>
            <td style="padding: 10px;">${doctorInfo.videoConsultationAvailable ? '✅ Available' : '❌ Not Available'}</td>
          </tr>
  </table>

  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-top: 20px;">
    You can review and verify the doctor in your admin panel.
  </p>

  <div style="text-align: center; margin-top: 30px;">
    <a href="www.google.com" style="text-decoration: none; background-color: #3498db; color: #ffffff; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">
      Go to Admin Panel
    </a>
  </div>
</div>

      `;

      await sendEmail({
        // to: adminEmail,
        subject: "New Doctor Registration Submitted",
        html: htmlMessage,
      });
    }

  


    // ---- Pharmacy role ----
if (role === "pharmacy" && pharmacyInfo) {
  if (!pharmacyInfo.pharmacyName || !pharmacyInfo.licenseNumber) {
    await User.findByIdAndDelete(newUser._id);
    return res.status(400).json({
      success: false,
      message: "Please provide pharmacy name and license number.",
    });
  }

  const pharmacyData = {
    user: newUser._id,
    pharmacyName: pharmacyInfo.pharmacyName,
    licenseNumber: pharmacyInfo.licenseNumber,
    phone: pharmacyInfo.phone || "",
    email: pharmacyInfo.email || "",
    address: pharmacyInfo.address || {},
    businessHours: pharmacyInfo.businessHours || [],
    deliveryAvailable: pharmacyInfo.deliveryAvailable || false,
    deliveryRadius: pharmacyInfo.deliveryRadius || 0,
    rejectionReason: "", // ✅ Initialize as empty string
    isVerified: false,
    isActive: true,
  };

  await Pharmacy.create(pharmacyData);

  // Send email to admin for pharmacy
  const pharmacyHtmlMessage = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border-radius: 10px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">💊 New Pharmacy Registration</h2>
    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
      A new pharmacy has submitted their registration and is pending verification. Please review the details below:
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px; font-weight: bold;">Pharmacy Name</td>
        <td style="padding: 10px;">${pharmacyInfo.pharmacyName}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Owner</td>
        <td style="padding: 10px;">${name}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px; font-weight: bold;">Email</td>
        <td style="padding: 10px;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Phone</td>
        <td style="padding: 10px;">${phone}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px; font-weight: bold;">License</td>
        <td style="padding: 10px;">${pharmacyInfo.licenseNumber}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Delivery Available</td>
        <td style="padding: 10px;">${pharmacyInfo.deliveryAvailable ? 'Yes' : 'No'}</td>
      </tr>
    </table>

    <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-top: 20px;">
      You can review and verify the pharmacy in your admin panel.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="www.google.com" style="text-decoration: none; background-color: #9b59b6; color: #ffffff; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Go to Admin Panel
      </a>
    </div>
  </div>
  `;

  await sendEmail({
    // to: adminEmail,
    subject: "💊 New Pharmacy Registration Submitted",
    html: pharmacyHtmlMessage,
  });
}

// ---- Laboratory role ----
if (role === "laboratory" && laboratoryInfo) {
  if (!laboratoryInfo.labName || !laboratoryInfo.licenseNumber) {
    await User.findByIdAndDelete(newUser._id);
    return res.status(400).json({
      success: false,
      message: "Please provide laboratory name and license number.",
    });
  }

  const laboratoryData = {
    user: newUser._id,
    labName: laboratoryInfo.labName,
    licenseNumber: laboratoryInfo.licenseNumber,
    phone: laboratoryInfo.phone || "",
    email: laboratoryInfo.email || "",
    address: laboratoryInfo.address || {},
    businessHours: laboratoryInfo.businessHours || [],
    homeCollectionAvailable: laboratoryInfo.homeCollectionAvailable || false,
    testsAvailable: laboratoryInfo.testsAvailable || [],
    rejectionReason: "", // ✅ Initialize as empty string
    isVerified: false,
    isActive: true,
  };

  await Laboratory.create(laboratoryData);

  // Send email to admin for laboratory
  const laboratoryHtmlMessage = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 25px; border-radius: 10px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">🔬 New Laboratory Registration</h2>
    <p style="color: #555555; font-size: 16px; line-height: 1.5;">
      A new laboratory has submitted their registration and is pending verification. Please review the details below:
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px; font-weight: bold;">Laboratory Name</td>
        <td style="padding: 10px;">${laboratoryInfo.labName}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Owner</td>
        <td style="padding: 10px;">${name}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px; font-weight: bold;">Email</td>
        <td style="padding: 10px;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Phone</td>
        <td style="padding: 10px;">${phone}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px; font-weight: bold;">License</td>
        <td style="padding: 10px;">${laboratoryInfo.licenseNumber}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold;">Home Collection</td>
        <td style="padding: 10px;">${laboratoryInfo.homeCollectionAvailable ? 'Available' : 'Not Available'}</td>
      </tr>
      <tr style="background-color: #f2f2f2;">
        <td style="padding: 10px; font-weight: bold;">Tests Available</td>
        <td style="padding: 10px;">${laboratoryInfo.testsAvailable?.length || 0} tests</td>
      </tr>
    </table>

    <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-top: 20px;">
      You can review and verify the laboratory in your admin panel.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="www.google.com" style="text-decoration: none; background-color: #1abc9c; color: #ffffff; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Go to Admin Panel
      </a>
    </div>
  </div>
  `;

  await sendEmail({
    // to: adminEmail,
    subject: "🔬 New Laboratory Registration Submitted",
    html: laboratoryHtmlMessage,
  });
}

    // Response
    const message =
      role === "user"
        ? "Patient account created successfully!"
        : `${
            role.charAt(0).toUpperCase() + role.slice(1)
          } account submitted for verification!`;

    res.status(201).json({
      success: true,
      message,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or license number already exists.",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// =======================
// Login (All Users + Admin)
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 1. Admin credentials check
    if (email === process.env.admingmail && password === process.env.adminpassword) {
      const token = jwt.sign(
        {
          email: process.env.admingmail,
          name: "Admin User",
          userType: "admin",
        },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin login successful!",
        token,
        email: process.env.admingmail,
        name: "Admin User",
        userType: "admin",
      });
    }

    // 2. Normal user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    // For professional roles, check verification
    if (user.role !== "user" && !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Account pending admin verification.",
      });
    }

    // Get role-specific data
    let roleData = null;
    if (user.role === "doctor") {
      roleData = await Doctor.findOne({ user: user._id });
    } else if (user.role === "pharmacy") {
      roleData = await Pharmacy.findOne({ user: user._id });
    } else if (user.role === "laboratory") {
      roleData = await Laboratory.findOne({ user: user._id });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        userType: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.role,
      isVerified: user.isVerified,
      roleData: roleData || undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// =======================
// Get Current User Profile
// =======================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let roleData = null;
    if (user.role === "doctor") {
      roleData = await Doctor.findOne({ user: user._id });
    } else if (user.role === "pharmacy") {
      roleData = await Pharmacy.findOne({ user: user._id });
    } else if (user.role === "laboratory") {
      roleData = await Laboratory.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        address: user.address,
        bloodGroup: user.bloodGroup,
        allergies: user.allergies,
        medicalHistory: user.medicalHistory,
      },
      roleData: roleData || undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// module.exports = {
//   register,
//   login
// };

export { register, login };
