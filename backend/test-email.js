// test-email.js
import dotenv from 'dotenv';
dotenv.config(); // ✅ Must be FIRST, before sendEmail import

import { sendEmail } from './Controllers/sendEmail.js';

async function test() {
  const result = await sendEmail({
    subject: "Test Email from MediCare",
    html: "<h1>✅ SendGrid is working!</h1><p>Your email configuration is correct.</p>"
  });

  if (result.success) {
    console.log("Test email sent successfully!");
  } else {
    console.log("Failed to send test email:", result.error);
  }
}

test();