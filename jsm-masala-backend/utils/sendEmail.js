import nodemailer from "nodemailer"; // Using ES Module import
import dotenv from "dotenv";       // Using ES Module import

dotenv.config(); // Load environment variables from .env

// --- Email Sending Utility ---
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // 1️⃣ Create transporter using environment variable *names*
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,   // Correctly access EMAIL_HOST
      port: process.env.EMAIL_PORT,   // Correctly access EMAIL_PORT
      auth: {
        user: process.env.EMAIL_USER, // Correctly access EMAIL_USER
        pass: process.env.EMAIL_PASS, // Correctly access EMAIL_PASS
      },
    });

    // 2️⃣ Define mail options (this part was mostly correct)
    const mailOptions = {
      from: `"JSM Masala" <no-reply@jsmmasala.com>`, // Using a more professional sender address
      to,          // recipient email
      subject,     // email subject
      text,        // plain text version
      html,        // optional HTML version
    };

    // 3️⃣ Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    // You can usually see the preview URL in the console when using Mailtrap
    console.log("✉️ Preview URL:", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error); // Log the full error for debugging
    // Re-throw the original error or a more specific one
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

export default sendEmail; // Using ES Module export