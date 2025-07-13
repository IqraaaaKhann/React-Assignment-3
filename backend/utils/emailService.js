import nodemailer from 'nodemailer';

const sendOTPEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTPEmail;
