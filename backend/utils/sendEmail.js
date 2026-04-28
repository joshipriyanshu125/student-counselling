import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({

      from: `"CounselHub" <${process.env.EMAIL_USER}>`,

      to,
      subject,


      text: text || "",


      html: html || `<p>${text}</p>`,
    });

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);


  }
};

export default sendEmail;