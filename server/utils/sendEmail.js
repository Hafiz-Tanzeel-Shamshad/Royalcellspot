const nodemailer = require('nodemailer');

const DEFAULT_ADMIN_EMAIL = 'royalcellspot@gmail.com';

let cachedTransporter;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return cachedTransporter;
};

/**
 * Send an email to the store owner/admin.
 *
 * Uses:
 * - EMAIL_USER (gmail)
 * - EMAIL_PASS (gmail app password)
 * - ADMIN_EMAIL (defaults to royalcellspot@gmail.com)
 */
const sendEmail = async (subject, text, options = {}) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      '[sendEmail] Skipping email: EMAIL_USER/EMAIL_PASS not configured'
    );
    return { skipped: true };
  }

  const from = options.from || process.env.EMAIL_USER;
  const to = options.to || process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  return { skipped: false, messageId: info.messageId };
};

module.exports = sendEmail;
