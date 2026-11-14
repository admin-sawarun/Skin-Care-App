const express = require('express');
const { z } = require('zod');
const validate = require('../middleware/validate');
const authController = require('../controllers/auth.controller');

const router = express.Router();

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const userRegisterSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional(),
});

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?\d{8,15}$/, 'Enter a valid phone number')
  // Indian mobile numbers are exactly 10 digits starting with 6-9.
  .refine((p) => !p.startsWith('+91') || /^\+91[6-9]\d{9}$/.test(p), 'Enter a valid 10-digit Indian mobile number');

const sendOtpSchema = z.object({
  phone: phoneSchema,
});

const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit code'),
});

// Firebase phone auth: the app runs the SMS OTP itself and sends us the
// resulting Firebase ID token (a JWT, always far longer than 20 chars).
const firebaseLoginSchema = z.object({
  idToken: z.string().min(20),
});

const doctorLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const doctorRegisterSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(/^\+?[0-9]{8,15}$/, 'Enter a valid phone number'),
  specialization: z.string().trim().max(100).optional(),
  experience: z.number().int().min(0).max(70).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  fcmToken: z.string().min(10).max(4096).optional(),
});

// Doctor signup is public, so cap it per IP to stop request spam. In-memory
// is enough for the single backend instance.
const SIGNUP_WINDOW_MS = 60 * 60 * 1000;
const SIGNUP_MAX_PER_WINDOW = 5;
const signupHits = new Map();
function limitDoctorSignup(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const hits = (signupHits.get(key) || []).filter((t) => now - t < SIGNUP_WINDOW_MS);
  if (hits.length >= SIGNUP_MAX_PER_WINDOW) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  hits.push(now);
  signupHits.set(key, hits);
  if (signupHits.size > 10000) signupHits.clear();
  return next();
}

router.post('/admin/login', validate({ body: adminLoginSchema }), authController.adminLogin);
router.post('/doctor/register', limitDoctorSignup, validate({ body: doctorRegisterSchema }), authController.doctorRegister);
router.post('/user/register', validate({ body: userRegisterSchema }), authController.userRegister);
router.post('/send-otp', validate({ body: sendOtpSchema }), authController.sendOtp);
router.post('/verify-otp', validate({ body: verifyOtpSchema }), authController.verifyOtp);
// Same OTP check as /verify-otp - the spec lists both paths for user login.
router.post('/user/login', validate({ body: verifyOtpSchema }), authController.verifyOtp);
// Production patient login - the app posts a Firebase phone-auth ID token.
router.post('/firebase', validate({ body: firebaseLoginSchema }), authController.firebaseLogin);
router.post('/doctor/login', validate({ body: doctorLoginSchema }), authController.doctorLogin);

module.exports = router;
