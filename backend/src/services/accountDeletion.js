// Deletes a patient account and every piece of data tied to it - used by
// both the in-app "Delete My Account" flow (DELETE /api/users/account) and
// the admin-completed public web deletion request. Case/Message/Solution/
// VideoCall/Ticket/Rating all cascade from User via Prisma's `onDelete:
// Cascade` relations (see schema.prisma); Notification and DeviceToken have
// no FK relation to User at all, so those are cleared explicitly first.
const prisma = require('../config/db');

async function deleteUserAccount(userId) {
  await prisma.notification.deleteMany({ where: { userId, userType: 'USER' } });
  await prisma.deviceToken.deleteMany({ where: { ownerId: userId, ownerType: 'USER' } });
  await prisma.user.delete({ where: { id: userId } });
}

module.exports = { deleteUserAccount };
