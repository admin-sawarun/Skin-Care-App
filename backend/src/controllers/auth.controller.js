const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const env = require('../config/env');
const otpService = require('../services/otp');
const firebase = require('../services/firebase');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sanitize = require('../utils/sanitize');
const { signToken, ROLES } = require('../utils/jwt');
const socket = require('../services/socket');

const SALT_ROUNDS = 10;

// POST /api/auth/admin/login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw ApiError.unauthorized('Invalid email or password');

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  const token = signToken({ id: admin.id, role: ROLES.ADMIN });
  res.json({ token, admin: sanitize(admin) });
});

// POST /api/auth/user/register
const userRegister = asyncHandler(async (req, res) => {
  const { name, phone, email } = req.body;

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) throw ApiError.conflict('This phone number is already registered');

  const user = await prisma.user.create({ data: { name, phone, email } });
  const token = signToken({ id: user.id, role: ROLES.USER });
  res.status(201).json({ token, user });
});

// The dev OTP login has no SMS delivery, so the code only ever reaches a
// user through `devOtp`. With that off (production), the only thing the
// endpoints still allow is guessing codes - so they're closed entirely.
// Real patients sign in through Firebase phone auth (POST /api/auth/firebase).
function assertDevOtpEnabled() {
  if (!env.OTP_SHOW_IN_RESPONSE) throw ApiError.notFound('Not found');
}

// POST /api/auth/send-otp
// Generates a fresh 6-digit code for this phone number and returns it as
// `devOtp` for the app to show on screen. Dev only - see assertDevOtpEnabled.
const sendOtp = asyncHandler(async (req, res) => {
  assertDevOtpEnabled();
  const { phone } = req.body;

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing?.isBlocked) throw ApiError.forbidden('This account has been blocked');

  const { code, expiresInSeconds } = await otpService.sendOtp(phone);
  res.json({
    message: 'OTP sent',
    expiresInSeconds,
    ...(env.OTP_SHOW_IN_RESPONSE && { devOtp: code }),
  });
});

// Shared patient login: finds the User for this number (or creates a
// lightweight account on first login) and issues their JWT. Used by both the
// dev OTP flow and the Firebase phone-auth flow so the two behave identically.
async function loginUserByPhone(phone) {
  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { name: 'New User', phone } });
  }
  if (user.isBlocked) throw ApiError.forbidden('This account has been blocked');

  const token = signToken({ id: user.id, role: ROLES.USER });
  return { token, role: 'USER', user };
}

// POST /api/auth/verify-otp  (also served as POST /api/auth/user/login)
// Dev/web patient login: checks the code issued by send-otp, then logs the
// patient in. Doctors do not log in here - they use email + password (POST
// /api/auth/doctor/login).
const verifyOtp = asyncHandler(async (req, res) => {
  assertDevOtpEnabled();
  const { phone, otp } = req.body;
  await otpService.verifyOtp(phone, otp);

  res.json(await loginUserByPhone(phone));
});

// POST /api/auth/firebase
// Production patient login: the app signs in with Firebase phone auth (the
// SMS OTP is delivered by Firebase) and posts the resulting ID token here.
// We verify it with the Admin SDK, take the phone number off the verified
// token, and then do exactly what /verify-otp does.
const firebaseLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  const auth = firebase.getAuth();
  if (!auth) throw new ApiError(503, 'Firebase sign-in is not configured on this server');

  let decoded;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired Firebase ID token');
  }

  const phone = decoded.phone_number;
  if (!phone) throw ApiError.badRequest('This Firebase account has no phone number');

  res.json(await loginUserByPhone(phone));
});

// POST /api/auth/doctor/register
// A doctor asks for an account from the app. It stays PENDING (no login)
// until an admin approves it; every admin is notified of the request. The
// optional FCM token lets us tell the doctor about the decision before they
// have ever logged in.
const doctorRegister = asyncHandler(async (req, res) => {
  const { name, phone, specialization, experience, password, fcmToken } = req.body;
  const email = req.body.email.toLowerCase();

  const [byEmail, byPhone] = await Promise.all([
    prisma.doctor.findUnique({ where: { email } }),
    prisma.doctor.findUnique({ where: { phone } }),
  ]);
  if (byEmail || byPhone) {
    throw ApiError.conflict(
      byEmail?.status === 'PENDING' || byPhone?.status === 'PENDING'
        ? 'A request with these details is already waiting for admin approval.'
        : 'A doctor account with this email or phone number already exists. Please log in instead.'
    );
  }

  const doctor = await prisma.doctor.create({
    data: {
      name,
      email,
      phone,
      specialization,
      experience,
      password: await bcrypt.hash(password, SALT_ROUNDS),
      status: 'PENDING',
      isAvailable: false,
    },
  });

  if (fcmToken) {
    await prisma.deviceToken.upsert({
      where: { token: fcmToken },
      update: { ownerId: doctor.id, ownerType: 'DOCTOR' },
      create: { token: fcmToken, ownerId: doctor.id, ownerType: 'DOCTOR' },
    });
  }

  const title = 'New doctor signup';
  const body = `${doctor.name}${doctor.specialization ? ` (${doctor.specialization})` : ''} requested a doctor account. Review it in Doctors.`;
  const admins = await prisma.admin.findMany({ select: { id: true } });
  if (admins.length) {
    await prisma.notification.createMany({
      data: admins.map((a) => ({ userId: a.id, userType: 'ADMIN', title, body, type: 'DOCTOR_SIGNUP' })),
    });
  }
  socket.emitToAllAdmins('notification', { title, body, type: 'DOCTOR_SIGNUP', doctorId: doctor.id });

  res.status(201).json({
    message: 'Your request has been sent. You will get a notification once the admin approves your account.',
  });
});

// POST /api/auth/doctor/login
// Doctors are created by an admin (approved straight away) or register
// themselves and wait for an admin's approval.
const doctorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const doctor = await prisma.doctor.findUnique({ where: { email: email.toLowerCase() } });
  if (!doctor || !doctor.password) throw ApiError.unauthorized('Invalid email or password');

  const valid = await bcrypt.compare(password, doctor.password);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  // Checked after the password, so the status never leaks to a wrong guess.
  if (doctor.status === 'PENDING') {
    throw ApiError.forbidden('Your account is waiting for admin approval. You will get a notification once it is approved.');
  }
  if (doctor.status === 'REJECTED') {
    throw ApiError.forbidden('Your doctor account request was not approved. Please contact Lock and Key Skin Care support.');
  }

  const token = signToken({ id: doctor.id, role: ROLES.DOCTOR });
  res.json({ token, role: 'DOCTOR', doctor: sanitize(doctor) });
});

module.exports = { adminLogin, userRegister, sendOtp, verifyOtp, firebaseLogin, doctorRegister, doctorLogin, SALT_ROUNDS };
