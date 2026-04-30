import nodemailer from "nodemailer";

export const sendEmail = async ({ subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      family: 4,
    });

    await transporter.sendMail({
      from: `"Health Admin" <${process.env.SMTP_USER}>`,
      to: "ahsaanmajeed198@gmail.com",
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};