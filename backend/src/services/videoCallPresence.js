const prisma = require('./../config/db');
const socket = require('./socket');
const fcm = require('./fcm');

// If the other side fetched a join token within this window, they're
// treated as "already in the call" and don't get alerted again - avoids
// re-notifying on every token refresh while both are mid-call.
const STALE_MS = 45 * 1000;

/**
 * Called from getVideoToken (both doctor.controller.js and user.controller.js)
 * whenever a side fetches a fresh join token. Flips a still-SCHEDULED call to
 * ONGOING on first fetch (unchanged from before), and alerts the other side
 * whenever they don't look like they're currently active in the call - not
 * just the very first join ever, so a call the doctor left and later
 * rejoins still rings the patient again instead of only firing once per
 * VideoCall row for its whole lifetime.
 */
async function markJoinedAndNotify({ videoCall, caseRecord, isDoctor, callerName }) {
  const now = new Date();
  const otherJoinedAt = isDoctor ? videoCall.patientJoinedAt : videoCall.doctorJoinedAt;
  const otherIsActive = Boolean(otherJoinedAt) && now - otherJoinedAt < STALE_MS;

  const data = isDoctor ? { doctorJoinedAt: now } : { patientJoinedAt: now };
  if (videoCall.status === 'SCHEDULED') data.status = 'ONGOING';
  await prisma.videoCall.update({ where: { id: videoCall.id }, data });

  if (otherIsActive) return;

  const targetId = isDoctor ? caseRecord.userId : caseRecord.doctorId;
  const targetType = isDoctor ? 'USER' : 'DOCTOR';
  if (!targetId) return;

  const payload = {
    caseId: caseRecord.id,
    title: 'Video call is live',
    body: `${callerName} has joined the call and is waiting for you.`,
    type: 'CALL_STARTED',
  };

  await prisma.notification.create({
    data: { userId: targetId, userType: targetType, title: payload.title, body: payload.body, type: payload.type, caseId: caseRecord.id },
  });
  if (targetType === 'USER') socket.emitToUser(targetId, 'notification', payload);
  else socket.emitToDoctor(targetId, 'notification', payload);
  await fcm.sendPushNotification({
    ownerId: targetId,
    ownerType: targetType,
    title: payload.title,
    body: payload.body,
    data: { caseId: caseRecord.id, type: 'CALL_STARTED' },
  });
}

module.exports = { markJoinedAndNotify };
