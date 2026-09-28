const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const socket = require('../services/socket');

// POST /api/public/account-deletion-requests
// Unauthenticated on purpose - Google Play requires this to be reachable
// without opening the app or logging in (see /account-deletion, the static
// page that posts here). Logs the request and pings admins rather than
// deleting immediately: there's no SMS provider wired up yet (see
// services/otp.js) to prove the submitter actually owns that phone number.
const createAccountDeletionRequest = asyncHandler(async (req, res) => {
  const { phone, reason } = req.body;

  const request = await prisma.accountDeletionRequest.create({
    data: { phone, reason: reason || null },
  });

  socket.emitToAllAdmins('account_deletion_requested', { id: request.id, phone: request.phone });

  res.status(201).json({ success: true });
});

module.exports = { createAccountDeletionRequest };
