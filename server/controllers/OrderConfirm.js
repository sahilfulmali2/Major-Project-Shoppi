// controllers/Sendmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

export const OrderConfirm = async (name, to) => {
  console.log("Inside OrderConfirm - name:", name, "email:", to);
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Order Confirmation !!!",
    html:`
      <div>
        <h2>Hey ${name} 👋</h2>
        <p>Your Order for  <strong>Shoppi</strong>! is confirmed🎉</p>
        <p>Order Tracking will be shared once Order is Shipped.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
