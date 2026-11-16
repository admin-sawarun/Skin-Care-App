// Centralized environment variable access. Loads .env once and exposes a
// single typed-ish object so the rest of the codebase never touches
// `process.env` directly.
require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET || 'dev-only-insecure-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-only-insecure-refresh-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  // Dev-only: returns the generated OTP in the send-otp response so the app
  // can show it on screen. Off unless explicitly "true" - leaving it on in
  // production lets anyone log into any patient account by phone number.
  // The Android app uses Firebase phone auth and never needs this.
  OTP_SHOW_IN_RESPONSE: process.env.OTP_SHOW_IN_RESPONSE === 'true',

  // Path to a downloaded service-account JSON file. Takes precedence over the
  // three vars below - see services/firebase.js.
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  // Cloud Storage bucket for photo/file uploads. Defaults to
  // "<project-id>.firebasestorage.app" when left empty.
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',

  AGORA_APP_ID: process.env.AGORA_APP_ID || '',
  AGORA_APP_CERTIFICATE: process.env.AGORA_APP_CERTIFICATE || '',

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  // Case-submission fee, in paise (smallest currency unit Razorpay expects).
  // 39900 paise = ₹399.
  CASE_SUBMISSION_FEE_PAISE: parseInt(process.env.CASE_SUBMISSION_FEE_PAISE, 10) || 39900,

  // Outgoing email (SMTP) for doctor-account notifications. When these are
  // empty the mailer is a no-op, so local dev and tests run without a mailbox.
  // On Railway set the Zoho (or other) account's app password, never the
  // normal login password.
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 465,
  // true for port 465 (SSL), false for 587 (STARTTLS).
  SMTP_SECURE: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  // The visible "from" address; defaults to SMTP_USER when left empty.
  MAIL_FROM: process.env.MAIL_FROM || '',

  // Brevo (HTTP email API). Preferred over SMTP when set, because some hosts
  // (e.g. Railway) block outbound SMTP ports - Brevo sends over HTTPS instead.
  // The MAIL_FROM address must be a verified sender in the Brevo account.
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
};

if (env.NODE_ENV !== 'test' && !env.DATABASE_URL) {
  // Not fatal at require-time (so tooling like `prisma generate` still works
  // without a .env file), but the app will fail fast once it tries to talk
  // to the database.
  console.warn('[env] DATABASE_URL is not set. Copy .env.example to .env and configure it.');
}

module.exports = env;
