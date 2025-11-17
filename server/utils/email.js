const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Your app password
  },
  // Add timeouts to prevent hanging
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,    // 5 seconds  
  socketTimeout: 10000,     // 10 seconds
  // Pool settings for better performance
  pool: true,
  maxConnections: 1,
  rateDelta: 20000,
  rateLimit: 5,
});

// Test connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service connection failed:', error.message);
  } else {
    console.log('✅ Email service is ready');
  }
});

exports.sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"Bastard Wears" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};