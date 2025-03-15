const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (receiveBody) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSCODE,
      },
    });

    const mailOptions = {
      from: {
        name: "Job Tinder",
        address: process.env.USER,
      },
      to: ["gametechjagan@gmail.com"],
      subject: "A new Request has come",
      text: receiveBody,
      // html: "<b>Hello world?</b>",
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = sendMail;
