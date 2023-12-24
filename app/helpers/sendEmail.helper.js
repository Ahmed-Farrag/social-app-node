const nodemailer = require("nodemailer");
const fs = require("fs");

const stmpConfig = {
  service: "gmail",
  service: "smtp.gmail.com",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Set secure to false
  requireTLS: true, // Add requireTLS
  auth: {
    user: "abctech22@gmail.com",
    pass: "nkar soig wwmo qtvk ",
  },
};

const sendActivationEmail = async (receiverEmail) => {
  try {
    const transporter = nodemailer.createTransport(stmpConfig);

    // if i wanna send file with my email like pdf
    const htmlContent = fs.readFileSync(
      "app/helpers/customFileName.html",
      "utf8"
    );
    // Read the HTML file
    const html = fs.readFileSync("app/helpers/customFileName.html", "utf8");

    let mailOptions = {
      from: "abctech22@gmail.com",
      to: receiverEmail,
      replyTo: "abctech22@gmail.com", // Set a reply-to address
      sender: "abctech22@gmail.com", // Set a sender address
      subject: "Activate your account",
      html: html,
      attachments: [
        {
          filename: "customFileName.html",
          content: htmlContent,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (e) {
    console.error("Error sending email:", e);
  }
};

module.exports = sendActivationEmail;
