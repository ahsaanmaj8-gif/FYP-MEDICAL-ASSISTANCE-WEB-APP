const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middleware/authMiddleware');
const {
  generateMeetingRoom,
  getMeetingDetails,
  endMeeting
} = require('../Controllers/videoController');

// All routes require authentication
router.use(requireSignIn);

// Generate/Get meeting room for an appointment
router.get('/appointment/:appointmentId/room', generateMeetingRoom);

// Get meeting details
router.get('/appointment/:appointmentId/details', getMeetingDetails);

// End meeting
router.post('/appointment/:appointmentId/end', endMeeting);

module.exports = router;