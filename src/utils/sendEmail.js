const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // create reusable transporter object using SMTP
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // your Gmail
        pass: process.env.PASSWORD, // your App Password (not Gmail password)
      },
    });

    // send mail
    await transporter.sendMail({
      from: `"Seeker Lounge" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);

    // Do not throw error → prevent signup from crashing
    // You can store OTP in DB anyway, and user can ask for "Resend OTP"
  }
};

module.exports = sendEmail;
