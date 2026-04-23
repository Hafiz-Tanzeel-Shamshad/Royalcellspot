const twilio = require('twilio');

const isValidE164Phone = (phone) => {
  if (!phone) return false;
  const normalized = String(phone).trim();
  // E.164: + followed by 8-15 digits, first digit 1-9 (no leading 0)
  return /^\+[1-9]\d{7,14}$/.test(normalized);
};

/**
 * Normalize a phone number to E.164.
 *
 * Supports common Pakistan inputs:
 * - 03XXXXXXXXX  -> +923XXXXXXXXX
 * - 3XXXXXXXXX   -> +923XXXXXXXXX
 * - 92XXXXXXXXXX -> +92XXXXXXXXXX
 */
const normalizePhoneToE164 = (phone) => {
  const raw = String(phone || '').trim();
  if (!raw) return '';

  if (isValidE164Phone(raw)) return raw;

  const digitsOnly = raw.replace(/[\s\-()]/g, '');

  // Pakistan mobile: 03XXXXXXXXX (11 digits)
  if (/^03\d{9}$/.test(digitsOnly)) {
    return `+92${digitsOnly.slice(1)}`;
  }

  // Pakistan mobile without leading 0: 3XXXXXXXXX (10 digits)
  if (/^3\d{9}$/.test(digitsOnly)) {
    return `+92${digitsOnly}`;
  }

  // Pakistan with country code but no +: 92XXXXXXXXXX (12 digits)
  if (/^92\d{10}$/.test(digitsOnly)) {
    return `+${digitsOnly}`;
  }

  return raw;
};

let cachedClient;

const getTwilioClient = () => {
  if (cachedClient) return cachedClient;

  const { TWILIO_SID, TWILIO_AUTH_TOKEN } = process.env;

  if (!TWILIO_SID || !TWILIO_AUTH_TOKEN) {
    return null;
  }

  cachedClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
  return cachedClient;
};

/**
 * Send an SMS via Twilio.
 *
 * Env vars:
 * - TWILIO_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_MESSAGING_SERVICE_SID (preferred)
 *   OR
 * - TWILIO_PHONE_NUMBER (fallback: Twilio "from" number)
 */
const sendSMS = async (phone, message) => {
  const smsEnabled = String(process.env.SMS_ENABLED ?? 'true').toLowerCase();
  if (smsEnabled === 'false' || smsEnabled === '0' || smsEnabled === 'no') {
    return { skipped: true, reason: 'SMS_ENABLED=false' };
  }

  // By default, avoid consuming Twilio quota in non-production unless explicitly forced.
  const forceSend = String(process.env.SMS_FORCE_SEND ?? 'false').toLowerCase();
  const shouldForceSend = forceSend === 'true' || forceSend === '1' || forceSend === 'yes';
  if (process.env.NODE_ENV !== 'production' && !shouldForceSend) {
    const to = normalizePhoneToE164(phone);
    return { skipped: true, reason: 'SMS skipped in non-production', to };
  }

  const dryRun = String(process.env.SMS_DRY_RUN ?? 'false').toLowerCase();
  if (dryRun === 'true' || dryRun === '1' || dryRun === 'yes') {
    const to = normalizePhoneToE164(phone);
    const body = String(message || '').trim();
    console.log('[sendSMS] DRY_RUN - not sending via Twilio', { to, bodyPreview: body.slice(0, 140) });
    return { skipped: true, reason: 'SMS_DRY_RUN=true', to };
  }

  const client = getTwilioClient();

  if (!client) {
    console.warn('[sendSMS] Skipping SMS: TWILIO_SID/TWILIO_AUTH_TOKEN not configured');
    return { skipped: true };
  }

  const to = normalizePhoneToE164(phone);

  if (!isValidE164Phone(to)) {
    const err = new Error(
      'Invalid phone number. Use E.164 format with country code (e.g., +923001234567), or Pakistan format 03XXXXXXXXX.'
    );
    err.code = 'INVALID_PHONE';
    throw err;
  }

  const body = String(message || '').trim();
  if (!body) {
    const err = new Error('SMS message body is required');
    err.code = 'INVALID_MESSAGE';
    throw err;
  }

  const baseArgs = {
    body,
    to,
  };

  const { TWILIO_MESSAGING_SERVICE_SID, TWILIO_PHONE_NUMBER } = process.env;

  const trySend = async (args) => {
    const response = await client.messages.create(args);
    return {
      skipped: false,
      sid: response.sid,
      status: response.status,
      to,
    };
  };

  // Prefer Messaging Service when available; fallback to explicit from-number.
  if (TWILIO_MESSAGING_SERVICE_SID) {
    try {
      return await trySend({ ...baseArgs, messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID });
    } catch (err) {
      // If Messaging Service fails and a from-number exists, retry once.
      if (TWILIO_PHONE_NUMBER) {
        return await trySend({ ...baseArgs, from: TWILIO_PHONE_NUMBER });
      }
      throw err;
    }
  }

  if (TWILIO_PHONE_NUMBER) {
    return await trySend({ ...baseArgs, from: TWILIO_PHONE_NUMBER });
  }

  const err = new Error(
    'Twilio sender not configured. Set TWILIO_MESSAGING_SERVICE_SID or TWILIO_PHONE_NUMBER.'
  );
  err.code = 'TWILIO_SENDER_NOT_CONFIGURED';
  throw err;
};

module.exports = sendSMS;
module.exports.sendSMS = sendSMS;
module.exports.isValidE164Phone = isValidE164Phone;
module.exports.normalizePhoneToE164 = normalizePhoneToE164;
