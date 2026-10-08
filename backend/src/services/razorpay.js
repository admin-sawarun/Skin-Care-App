// Razorpay SDK bootstrap - single instance shared by the payments
// controller. Both keys are test-mode keys right now (see backend/.env);
// swapping to live keys later needs no code change.
const Razorpay = require('razorpay');
const env = require('../config/env');

const isConfigured = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

const razorpay = isConfigured
  ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
  : null;

module.exports = { razorpay, isConfigured };
