const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const socket = require('../services/socket');
const firebase = require('../services/firebase');
const ApiError = require('../utils/ApiError');

// POST /api/public/account-deletion-requests
// Unauthenticated on purpose - Google Play requires this to be reachable
// without opening the app or logging in (see /account-deletion, the static
// page that posts here). The page runs its own Firebase phone-OTP flow
// first and posts the resulting ID token - same verification /auth/firebase
// uses for login - so the phone number here is always the verified
// submitter's own, never a raw/unproven value from the request body.
const createAccountDeletionRequest = asyncHandler(async (req, res) => {
  const { idToken, reason } = req.body;

  const auth = firebase.getAuth();
  if (!auth) throw new ApiError(503, 'Firebase sign-in is not configured on this server');

  let decoded;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired verification code. Please verify your phone number again.');
  }

  const phone = decoded.phone_number;
  if (!phone) throw ApiError.badRequest('This Firebase account has no phone number');

  const request = await prisma.accountDeletionRequest.create({
    data: { phone, reason: reason || null },
  });

  socket.emitToAllAdmins('account_deletion_requested', { id: request.id, phone: request.phone });

  res.status(201).json({ success: true });
});

module.exports = { createAccountDeletionRequest };
