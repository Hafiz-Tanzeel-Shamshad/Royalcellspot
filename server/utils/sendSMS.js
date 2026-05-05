const https = require('https');

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

const isValidLifetimePhone = (phone) => {
  if (!phone) return false;
  return /^92\d{10}$/.test(String(phone).trim());
};

const normalizePhoneToLifetime = (phone) => {
  const raw = String(phone || '').trim();
  if (!raw) return '';

  if (raw.includes(',')) {
    return raw
      .split(',')
      .map((entry) => normalizePhoneToLifetime(entry))
      .filter(Boolean)
      .join(',');
  }

  if (isValidE164Phone(raw)) {
    return raw.replace(/^\+/, '');
  }

  const digitsOnly = raw.replace(/[\s\-()]/g, '');

  if (/^03\d{9}$/.test(digitsOnly)) {
    return `92${digitsOnly.slice(1)}`;
  }

  if (/^3\d{9}$/.test(digitsOnly)) {
    return `92${digitsOnly}`;
  }

  if (/^92\d{10}$/.test(digitsOnly)) {
    return digitsOnly;
  }

  return digitsOnly;
};

const LIFETIMESMS_BASE_URL = 'https://lifetimesms.com/json';

const postLifetimeSms = (params) =>
  new Promise((resolve, reject) => {
    const postData = params.toString();
    const request = https.request(
      LIFETIMESMS_BASE_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch (err) {
            parsed = { raw: data };
          }

          if (response.statusCode < 200 || response.statusCode >= 300) {
            const error = new Error('LifetimeSMS request failed');
            error.status = response.statusCode;
            error.details = parsed;
            return reject(error);
          }

          return resolve({ statusCode: response.statusCode, response: parsed });
        });
      }
    );

    request.on('error', (err) => reject(err));
    request.write(postData);
    request.end();
  });

/**
 * Send an SMS via LifetimeSMS.
 *
 * Env vars:
 * - LIFETIMESMS_API_TOKEN
 * - LIFETIMESMS_API_SECRET
 * - LIFETIMESMS_SENDER (max 11 chars)
 */
const sendSMS = async (phone, message) => {
  const smsEnabled = String(process.env.SMS_ENABLED ?? 'true').toLowerCase();
  if (smsEnabled === 'false' || smsEnabled === '0' || smsEnabled === 'no') {
    return { skipped: true, reason: 'SMS_ENABLED=false' };
  }

  // By default, avoid consuming SMS quota in non-production unless explicitly forced.
  const forceSend = String(process.env.SMS_FORCE_SEND ?? 'false').toLowerCase();
  const shouldForceSend = forceSend === 'true' || forceSend === '1' || forceSend === 'yes';
  if (process.env.NODE_ENV !== 'production' && !shouldForceSend) {
    const to = normalizePhoneToLifetime(phone);
    return { skipped: true, reason: 'SMS skipped in non-production', to };
  }

  const dryRun = String(process.env.SMS_DRY_RUN ?? 'false').toLowerCase();
  if (dryRun === 'true' || dryRun === '1' || dryRun === 'yes') {
    const to = normalizePhoneToLifetime(phone);
    const body = String(message || '').trim();
    console.log('[sendSMS] DRY_RUN - not sending via LifetimeSMS', {
      to,
      bodyPreview: body.slice(0, 140),
    });
    return { skipped: true, reason: 'SMS_DRY_RUN=true', to };
  }

  const apiToken = String(process.env.LIFETIMESMS_API_TOKEN || '4b491b5f84804a5e8030b43d6577eb5f011c5b10772').trim();
  const apiSecret = String(process.env.LIFETIMESMS_API_SECRET || 'ali').trim();

  if (!apiToken || !apiSecret) {
    console.warn('[sendSMS] Skipping SMS: LIFETIMESMS_API_TOKEN/LIFETIMESMS_API_SECRET not configured');
    return { skipped: true };
  }

  const normalizedTo = normalizePhoneToLifetime(phone);
  const toList = String(normalizedTo)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (toList.length === 0 || toList.some((entry) => !isValidLifetimePhone(entry))) {
    const err = new Error(
      'Invalid phone number. Use Pakistan format 03XXXXXXXXX or E.164 format +923001234567.'
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

  const sender = 'SMS Alert';
  if (!sender) {
    const err = new Error('SMS sender ID is required (max 11 chars).');
    err.code = 'INVALID_SENDER';
    throw err;
  }

  if (sender.length > 11) {
    const err = new Error('SMS sender ID must be 11 characters or less.');
    err.code = 'INVALID_SENDER_LENGTH';
    throw err;
  }

  const params = new URLSearchParams({
    api_token: apiToken,
    api_secret: apiSecret,
    to: toList.join(','),
    from: sender,
    message: body,
  });

  const response = await postLifetimeSms(params);
  console.log('[sendSMS] LifetimeSMS response', response.response);
  return {
    skipped: false,
    to: toList.join(','),
    status: response.statusCode,
    response: response.response,
  };
};

module.exports = sendSMS;
module.exports.sendSMS = sendSMS;
module.exports.isValidE164Phone = isValidE164Phone;
module.exports.normalizePhoneToE164 = normalizePhoneToE164;
