import nodemailer from "nodemailer";

type EmailType = "otp-verification" | "general";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});
const getOTPTemplate = (message: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    .header {
      background: #4F46E5;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #ffffff;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 0 0 10px 10px;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #4F46E5;
      text-align: center;
      padding: 20px;
      margin: 20px 0;
      background: #F3F4F6;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      color: #6B7280;
      font-size: 12px;
      margin-top: 20px;
    }
    .note {
      color: #EF4444;
      font-size: 14px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>Verification Code</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your verification code is:</p>
      <div class="otp-code">${message}</div>
      <p>Please use this code to complete your verification process.</p>
      <p class="note">This code will expire in 5 minutes.</p>
      <div class="footer">
        <p>This is an automated message, please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const getGeneralTemplate = (message: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    .content {
      background: #ffffff;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      color: #6B7280;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      ${message}
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} InterviewHub. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export async function Mailer(
  to: string,
  subject: string,
  message: string,
  type: EmailType = "general"
): Promise<boolean> {
  const htmlContent =
    type === "otp-verification"
      ? getOTPTemplate(message)
      : getGeneralTemplate(message);

  const mailOptions = {
    from: '"InterviewHub" <no-reply@example.com>',
    to,
    subject,
    text: message,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export { transporter };
