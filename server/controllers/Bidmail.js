
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

export const Bidmail = async (name, to,bidAmount,productname) => {
  console.log("Inside bidmail - name:", name, "email:", to);
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Order Confirmation !!!",
    html:`
      <div>
        <h2>Hey ${name} 👋</h2>
        <p>Congratulations! Your bid for the product <strong>${productname}</strong> has been confirmed 🎉</p>
        <p>Bid Amount: ₹${bidAmount}</p>
        <p>Your order will be processed soon, and tracking details will be shared once the order is shipped.</p>
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
