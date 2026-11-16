// Outgoing email service (SMTP via nodemailer).
//
// Used for doctor-account lifecycle emails: a "request received" note when a
// doctor self-registers, and an "approved"/"not approved" note when an admin
// decides the request.
//
// When SMTP_* env vars are empty the module is a no-op stub that just logs,
// so local dev and tests run without a mailbox and no call site has to change
// (same pattern as services/fcm.js). Every send is best-effort: failures are
// caught and logged, never thrown, so a mail problem can't break approval.
const nodemailer = require('nodemailer');
const env = require('../config/env');

const isConfigured = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);

let transporter = null;
function getTransporter() {
  if (!isConfigured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
}

const FROM = () => env.MAIL_FROM || env.SMTP_USER;
const BRAND = 'Lock and Key Skin Care';

// Minimal, inline-styled HTML so it renders the same across mail clients.
function wrap(heading, lines, accent = '#0f766e') {
  const paragraphs = lines.map((l) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">${l}</p>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;padding:24px;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr><td style="background:${accent};padding:22px 28px;">
        <span style="color:#ffffff;font-size:18px;font-weight:bold;">${BRAND}</span>
      </td></tr>
      <tr><td style="padding:28px;">
        <h2 style="margin:0 0 16px;font-size:20px;color:#0f172a;">${heading}</h2>
        ${paragraphs}
      </td></tr>
      <tr><td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated message from ${BRAND}. Please do not reply to this email.</p>
      </td></tr>
    </table>
  </td></tr></table>
  </body></html>`;
}

async function send({ to, subject, heading, lines, accent }) {
  const tx = getTransporter();
  if (!tx) {
    console.log(`[mailer] (stub, SMTP not configured) would email ${to}: ${subject}`);
    return;
  }
  try {
    await tx.sendMail({
      from: `${BRAND} <${FROM()}>`,
      to,
      subject,
      text: lines.map((l) => l.replace(/<[^>]+>/g, '')).join('\n\n'),
      html: wrap(heading, lines, accent),
    });
    console.log(`[mailer] sent "${subject}" to ${to}`);
  } catch (err) {
    console.error(`[mailer] failed to email ${to}:`, err.message);
  }
}

// A doctor just submitted a self-registration request.
async function sendDoctorRegistrationReceived(doctor) {
  if (!doctor?.email) return;
  await send({
    to: doctor.email,
    subject: `We received your doctor account request — ${BRAND}`,
    heading: `Hi Dr. ${doctor.name || ''},`.trim(),
    lines: [
      `Thank you for requesting a doctor account with <b>${BRAND}</b>.`,
      'Our admin team will review your details. Once your account is approved, you will get another email, and you can log in with the <b>same email and password</b> you registered with — just choose <b>"Login for doctors"</b> in the app.',
      'Please wait for the approval. No action is needed from you right now.',
    ],
  });
}

// An admin approved or rejected the request.
async function sendDoctorDecision(doctor, approved) {
  if (!doctor?.email) return;
  if (approved) {
    await send({
      to: doctor.email,
      subject: `Your doctor account is approved — ${BRAND}`,
      heading: `Good news, Dr. ${doctor.name || ''}!`.trim(),
      lines: [
        `Your doctor account with <b>${BRAND}</b> has been <b>approved</b>.`,
        'You can now log in with the <b>same email and password</b> you registered with. Open the app, tap the menu on the login screen, choose <b>"Login for doctors"</b>, and sign in.',
        'Welcome aboard — you can now start reviewing and helping patients.',
      ],
    });
  } else {
    await send({
      to: doctor.email,
      subject: `About your doctor account request — ${BRAND}`,
      heading: `Hi Dr. ${doctor.name || ''},`.trim(),
      accent: '#b91c1c',
      lines: [
        `We're sorry, but your doctor account request with <b>${BRAND}</b> was <b>not approved</b> at this time.`,
        'If you believe this was a mistake or need more information, please contact our support team.',
      ],
    });
  }
}

module.exports = {
  isConfigured,
  sendDoctorRegistrationReceived,
  sendDoctorDecision,
};
