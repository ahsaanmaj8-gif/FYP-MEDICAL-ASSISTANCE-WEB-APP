const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const crypto = require('crypto');

// =======================
// Generate Jitsi Meeting Room
// =======================
// exports.generateMeetingRoom = async (req, res) => {
//   try {
//     const { appointmentId } = req.params;
//     const userId = req.user._id;
//     const userType = req.user.userType; // 'doctor' or 'user'

//     // Find the appointment
//     const appointment = await Appointment.findById(appointmentId)
//       .populate('patient')
//       .populate({
//         path: 'doctor',
//         populate: { path: 'user', select: 'name' }
//       });

//     if (!appointment) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Appointment not found' 
//       });
//     }

//     // Verify user is authorized (either the doctor or the patient)
//     const isDoctor = appointment.doctor.user._id.toString() === userId.toString();
//     const isPatient = appointment.patient._id.toString() === userId.toString();

//     if (!isDoctor && !isPatient) {
//       return res.status(403).json({ 
//         success: false, 
//         message: 'Not authorized to join this consultation' 
//       });
//     }

//     // Check if it's a video consultation
//     if (appointment.appointmentType !== 'video-consultation') {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'This is not a video consultation appointment' 
//       });
//     }

//     // Check if appointment time is valid (allow joining 15 mins before to 30 mins after)
//     const appointmentTime = new Date(appointment.appointmentDate);
//     const [hours, minutes] = appointment.appointmentTime.split(':');
//     appointmentTime.setHours(parseInt(hours), parseInt(minutes), 0);

//     const now = new Date();
//     const fifteenMinsBefore = new Date(appointmentTime.getTime() - 15 * 60000);
//     const thirtyMinsAfter = new Date(appointmentTime.getTime() + 30 * 60000);

//     if (now < fifteenMinsBefore) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'You can join the consultation 15 minutes before the scheduled time' 
//       });
//     }

//     if (now > thirtyMinsAfter) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'This consultation time has passed' 
//       });
//     }

//     // Generate or retrieve existing room
//     if (!appointment.videoLink) {
//       // Generate unique room name
//       const roomName = `medicare-${appointment._id}-${crypto.randomBytes(4).toString('hex')}`;
      
//       // Generate room password (optional, can use JWT instead)
//       const roomPassword = crypto.randomBytes(6).toString('hex');

//       // Store in appointment
//       appointment.videoLink = roomName;
//       appointment.meetingId = roomPassword;
//       await appointment.save();
//     }

//     // Generate JWT token for Jitsi authentication (if using secure mode)
//     const jitsiToken = generateJitsiToken(
//       appointment.videoLink,
//       req.user.name,
//       isDoctor ? 'doctor' : 'patient',
//       appointment._id.toString()
//     );

//     res.json({
//       success: true,
//       data: {
//         roomName: appointment.videoLink,
//         roomPassword: appointment.meetingId,
//         jitsiToken,
//         userName: req.user.name,
//         userType: isDoctor ? 'doctor' : 'patient',
//         appointmentTime: appointment.appointmentTime,
//         doctorName: appointment.doctor.user?.name,
//         patientName: appointment.patient.name
//       }
//     });

//   } catch (error) {
//     console.error('Error generating meeting room:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to generate meeting room',
//       error: error.message 
//     });
//   }
// };




// =======================
// Generate Jitsi Meeting URL (Official meet.jit.si)
// =======================
exports.generateMeetingRoom = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user._id;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      });

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Verify user is authorized
    const isDoctor = appointment.doctor.user._id.toString() === userId.toString();
    const isPatient = appointment.patient._id.toString() === userId.toString();

    if (!isDoctor && !isPatient) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to join this consultation' 
      });
    }

    // Check if it's a video consultation
    if (appointment.appointmentType !== 'video-consultation') {
      return res.status(400).json({ 
        success: false, 
        message: 'This is not a video consultation appointment' 
      });
    }

    // Generate unique room name using appointment ID
    const roomName = `MediCare-${appointment._id}`;

    // Create Jitsi Meet URL
    const jitsiMeetUrl = `https://meet.jit.si/${roomName}`;

    // Store in appointment
    appointment.videoLink = jitsiMeetUrl;
    await appointment.save();

    // Determine user role
    const userRole = isDoctor ? 'doctor' : 'patient';
    const otherParty = isDoctor ? appointment.patient.name : appointment.doctor.user?.name;

    res.json({
      success: true,
      data: {
        roomName: roomName,
        meetingUrl: jitsiMeetUrl,
        userRole: userRole,
        otherPartyName: otherParty,
        appointmentTime: appointment.appointmentTime,
        appointmentDate: appointment.appointmentDate
      }
    });

  } catch (error) {
    console.error('Error generating meeting:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate meeting',
      error: error.message 
    });
  }
};
// =======================
// Get Meeting Details
// =======================
exports.getMeetingDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user._id;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' }
      });

    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Check authorization
    const isDoctor = appointment.doctor.user._id.toString() === userId.toString();
    const isPatient = appointment.patient._id.toString() === userId.toString();

    if (!isDoctor && !isPatient) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    if (!appointment.videoLink) {
      return res.json({
        success: true,
        data: {
          roomExists: false,
          message: 'Meeting not yet started'
        }
      });
    }

    res.json({
      success: true,
      data: {
        roomExists: true,
        roomName: appointment.videoLink,
        meetingId: appointment.meetingId,
        appointmentTime: appointment.appointmentTime,
        doctorName: appointment.doctor.user?.name,
        patientName: appointment.patient.name,
        startedBy: isDoctor ? 'doctor' : 'patient'
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// =======================
// End Meeting
// =======================
exports.endMeeting = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }

    // Clear video link (optional - can keep for history)
    // appointment.videoLink = null;
    // appointment.meetingId = null;
    await appointment.save();

    res.json({
      success: true,
      message: 'Meeting ended successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// =======================
// Helper: Generate Jitsi JWT Token (for secure rooms)
// =======================
const generateJitsiToken = (roomName, userName, userType, appointmentId) => {
  // This is for Jitsi's JWT authentication (optional)
  // You'll need JWT_APP_ID and JWT_APP_SECRET in your .env
  
  const jwt = require('jsonwebtoken');
  
  const payload = {
    context: {
      user: {
        name: userName,
        email: `${userType}@medicare.local`,
        id: appointmentId,
        avatar: '',
        "moderator": userType === 'doctor' ? 'true' : 'false'
      },
      features: {
        livestreaming: false,
        recording: false,
        transcription: false,
        "outbound-call": false
      }
    },
    aud: 'jitsi',
    iss: process.env.JITSI_APP_ID || 'medicare',
    sub: 'meet.jitsi',
    room: roomName,
    exp: Math.floor(Date.now() / 1000) + 7200 // 2 hours
  };

  // If you have JWT secret configured
  if (process.env.JITSI_APP_SECRET) {
    return jwt.sign(payload, process.env.JITSI_APP_SECRET, { algorithm: 'HS256' });
  }
  
  return null; // Return null if no JWT configured (uses open rooms)
};