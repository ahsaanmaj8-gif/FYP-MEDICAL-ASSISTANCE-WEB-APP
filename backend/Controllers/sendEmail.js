// import nodemailer from "nodemailer";

// export const sendEmail = async ({ subject, html }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT),
//       secure: process.env.SMTP_SECURE === "true",
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//       connectionTimeout: 10000,
//       family: 4,
//     });

//     await transporter.sendMail({
//       from: `"Health Admin" <${process.env.SMTP_USER}>`,
//       to: "ahsaanmajeed198@gmail.com",
//       subject,
//       html,
//     });

//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Email sending failed:", error);
//   }
// };



// import sgMail from '@sendgrid/mail';

// // Initialize SendGrid with API key

// export const sendEmail = async ({ subject, html }) => {
//   try {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//       to: "ahsaanmajeed57@gmail.com",
//       from: process.env.SENDGRID_FROM_EMAIL || "ahsaanmajeed57@gmail.com",
//       subject: subject,
//       html: html,
//     };

//     await sgMail.send(msg);
//     console.log("✅ Email sent successfully via SendGrid");
//     return { success: true };
    
//   } catch (error) {
//     console.error("❌ Email sending failed:", error.response?.body || error.message);
//     return { success: false, error: error.message };
//   }
// };


import sgMail from '@sendgrid/mail';

export async function sendEmail({ subject, html }) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: "ahsaanmajeed57@gmail.com",
    from: {
      email: process.env.SENDGRID_FROM_EMAIL || "ahsaanmajeed57@gmail.com", // ✅ 'email' not 'from'
      name: 'MediCare'
    },
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.log('❌ Email sending failed:', error.response?.body || error.message);
    return { success: false, error: error.message };
  }
}