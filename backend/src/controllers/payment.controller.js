const crypto = require('node:crypto');
const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const { razorpay, isConfigured } = require('../services/razorpay');

// POST /api/users/payments/order
// Creates a Razorpay order for the ₹399 case-submission fee and a matching
// Payment row in CREATED status. The Flutter app opens Razorpay Checkout
// with the returned order id, then calls /verify once the user pays.
const createOrder = asyncHandler(async (req, res) => {
  if (!isConfigured) throw new ApiError(503, 'Payments are not configured on this server');

  const amount = env.CASE_SUBMISSION_FEE_PAISE;
  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    // Razorpay receipts are capped at 40 characters.
    receipt: `case_${req.user.id}_${Date.now()}`.slice(0, 40),
  });

  const payment = await prisma.payment.create({
    data: {
      userId: req.user.id,
      razorpayOrderId: order.id,
      amount,
      status: 'CREATED',
    },
  });

  res.status(201).json({
    paymentId: payment.id,
    orderId: order.id,
    amount,
    currency: 'INR',
    keyId: env.RAZORPAY_KEY_ID,
  });
});

// POST /api/users/payments/verify
// Verifies the HMAC-SHA256 signature Razorpay Checkout hands back, exactly
// as Razorpay's docs specify - this is the only trustworthy way to know a
// payment actually succeeded (the client-side "success" callback alone can
// be spoofed). Marks the Payment PAID only once the signature checks out.
const verifyPayment = asyncHandler(async (req, res) => {
  if (!isConfigured) throw new ApiError(503, 'Payments are not configured on this server');

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw ApiError.badRequest('Missing payment verification fields');
  }

  const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
  if (!payment || payment.userId !== req.user.id) throw ApiError.notFound('Payment not found');

  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isValid = expectedSignature === razorpay_signature;

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: isValid ? 'PAID' : 'FAILED',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    },
  });

  if (!isValid) throw ApiError.badRequest('Payment verification failed');

  res.json({ paymentId: updated.id, status: updated.status });
});

// GET /api/users/payments
// The signed-in patient's own payment history - amount, status, and
// whether the case it paid for was ever submitted (a payment can exist
// without a case if checkout succeeded but the case-create call never
// landed, e.g. the app closed mid-flow).
const listMyPayments = asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: { case: { select: { id: true, status: true } } },
  });

  res.json({ data: payments });
});

module.exports = { createOrder, verifyPayment, listMyPayments };
