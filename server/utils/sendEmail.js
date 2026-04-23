const nodemailer = require('nodemailer');

const DEFAULT_ADMIN_EMAIL = 'royalcellspot@gmail.com';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000; // 1s base — doubles each attempt (1s, 2s, 4s)

let cachedTransporter;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    // Explicit Gmail SMTP — avoids relying on the 'service' shorthand which
    // can miss timeout/TLS settings in some nodemailer versions.
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS on port 587
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    // TLS settings — accept Gmail's certificate and modern cipher suites.
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
    // Connection pool — reuse up to 5 connections instead of opening a new
    // one per message, which reduces handshake overhead and timeout risk.
    pool: true,
    maxConnections: 5,
    maxMessages: Infinity,
    // Timeouts — Railway asia-southeast1 egress can be slow on cold starts;
    // 30s connection + 60s socket gives enough headroom without hanging forever.
    connectionTimeout: 30000, // 30s (default is 2 min, but we want to fail fast)
    greetingTimeout: 30000,   // 30s to receive the SMTP greeting
    socketTimeout: 60000,     // 60s idle socket timeout
  });

  return cachedTransporter;
};

/**
 * Attempt to send a single mail via the transporter.
 * Throws on failure so the retry wrapper can catch it.
 */
const attemptSend = async (transporter, mailOptions) => {
  const info = await transporter.sendMail(mailOptions);
  return info;
};

/**
 * Classify a nodemailer / net error to produce a meaningful log line.
 */
const classifyError = (err) => {
  const code = err.code || '';
  const msg  = (err.message || '').toLowerCase();

  if (code === 'ETIMEDOUT' || code === 'ESOCKET' || msg.includes('timeout')) {
    return 'NETWORK_TIMEOUT';
  }
  if (code === 'ECONNREFUSED' || code === 'ENOTFOUND' || code === 'ENETUNREACH') {
    return 'NETWORK_UNREACHABLE';
  }
  if (
    code === 'EAUTH' ||
    msg.includes('invalid login') ||
    msg.includes('username and password') ||
    msg.includes('authentication')
  ) {
    return 'AUTH_FAILURE';
  }
  return 'UNKNOWN';
};

/**
 * Send an email to the store owner/admin.
 *
 * Retries up to MAX_RETRIES times with exponential backoff.
 * On final failure the error is logged but NOT re-thrown so a broken SMTP
 * configuration never crashes the order flow.
 *
 * Uses:
 * - EMAIL_USER  (Gmail address)
 * - EMAIL_PASS  (Gmail App Password)
 * - ADMIN_EMAIL (recipient; defaults to royalcellspot@gmail.com)
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
  const to   = options.to   || process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;

  const mailOptions = { from, to, subject, text };

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const info = await attemptSend(transporter, mailOptions);
      if (attempt > 1) {
        console.log(`[sendEmail] Succeeded on attempt ${attempt}. messageId=${info.messageId}`);
      }
      return { skipped: false, messageId: info.messageId };
    } catch (err) {
      lastError = err;
      const kind = classifyError(err);

      console.error(
        `[sendEmail] Attempt ${attempt}/${MAX_RETRIES} failed — type=${kind} code=${err.code || 'N/A'} message="${err.message}"`
      );

      // Auth failures won't be fixed by retrying — bail out immediately.
      if (kind === 'AUTH_FAILURE') {
        console.error('[sendEmail] Authentication error — check EMAIL_USER and EMAIL_PASS (use a Gmail App Password, not your account password).');
        break;
      }

      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`[sendEmail] Retrying in ${delay}ms…`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Graceful degradation — log the final error but don't propagate it so the
  // caller (order controller) can still return a successful response to the user.
  console.error(
    `[sendEmail] All ${MAX_RETRIES} attempts exhausted. Email NOT sent. subject="${subject}" to="${to}"`,
    lastError
  );
  return { skipped: false, failed: true, error: lastError?.message };
};

module.exports = sendEmail;
