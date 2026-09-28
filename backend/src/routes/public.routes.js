const express = require('express');
const { z } = require('zod');
const validate = require('../middleware/validate');
const publicController = require('../controllers/public.controller');

// Deliberately outside authenticate/requireUser - see public.controller.js
// for why this has to be reachable with no login at all.
const router = express.Router();

const accountDeletionRequestSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{8,15}$/, 'Enter a valid phone number'),
  reason: z.string().trim().max(500).optional(),
});

router.post(
  '/account-deletion-requests',
  validate({ body: accountDeletionRequestSchema }),
  publicController.createAccountDeletionRequest
);

module.exports = router;
