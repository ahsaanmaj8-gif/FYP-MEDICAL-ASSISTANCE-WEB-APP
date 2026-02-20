const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const adminRouter = require('./routes/adminRouter');
const labRouter = require('./routes/labRouter');
const labBookingRouter = require('./routes/labBookingRouter');
const contactRouter = require("./routes/contactRouter"); 
const publicRouter = require("./routes/publicRouter");
const pharmacyRouter = require("./routes/pharmacyRouter");
const patientRouter = require('./routes/patientRouter');
const appointmentRouter = require('./routes/appointmentRouter');
const doctorRouter = require('./routes/doctorRouter');
const statsRouter = require('./routes/statsRouter');
const videoRouter = require('./routes/videoRouter');
const reviewRouter = require('./routes/reviewRouter');

require("dotenv").config();
require("./config/connection_db");

const app = express();
const PORT = process.env.PORT || 8085;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes



app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1', statsRouter);
app.use('/api/v1/patient',patientRouter)
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/appointments', appointmentRouter);

app.use('/api/v1/video', videoRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/lab', labRouter);
app.use('/api/v1/lab-booking', labBookingRouter);
app.use('/api/v1/public', publicRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/pharmacy', pharmacyRouter);



app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: "MediCare API is running!",
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Server is not listening on PORT ${PORT}!`);
  } else {
    console.log(`MediCare Server is listening on PORT ${PORT}!`);
  }
});