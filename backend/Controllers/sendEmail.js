import nodemailer from "nodemailer";

export const sendEmail = async ({  subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Health Admin" <${process.env.SMTP_USER}>`,
      to: "ahsaanmajeed198@gmail.com",
      subject,
      html,
    });

    console.log("Email sent to", "ahsaanmajeed198@gmail.com");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
