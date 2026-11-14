// Removes the demo records that prisma/seed.js created, so the live admin
// dashboard only shows real doctors, patients and cases.
//
//   node scripts/remove-demo-data.js           dry run: prints what it would delete
//   node scripts/remove-demo-data.js --apply   deletes it
//
// Add --all-cases to also delete every case in the database (with its
// messages, solutions, status history, ratings and video calls), for when all
// existing cases are test data. Payments and user accounts other than the demo
// patients are kept.
//
// It only touches the exact demo doctors (by email) and demo patients (by phone)
// from seed.js. The admin account and the question flow are kept: the admin is
// the real login and the app needs a question flow. Safe to run more than once.
const { PrismaClient } = require('@prisma/client');

const DEMO_DOCTOR_EMAILS = [
  'ayesha.khan@skincareapp.com',
  'rohan.mehta@skincareapp.com',
  'priya.sharma@skincareapp.com',
  'karan.verma@skincareapp.com',
];
const DEMO_USER_PHONES = ['+919820000001', '+919820000002', '+919820000003'];

const prisma = new PrismaClient();
const APPLY = process.argv.includes('--apply');
const ALL_CASES = process.argv.includes('--all-cases');

async function main() {
  const doctors = await prisma.doctor.findMany({
    where: { email: { in: DEMO_DOCTOR_EMAILS } },
    select: { id: true, name: true },
  });
  const users = await prisma.user.findMany({
    where: { phone: { in: DEMO_USER_PHONES } },
    select: { id: true, name: true },
  });
  const doctorIds = doctors.map((d) => d.id);
  const userIds = users.map((u) => u.id);

  // Demo patients' cases go with them (cascade). Real patients' cases that were
  // assigned to a demo doctor go back to the queue, as the admin "delete
  // doctor" action does.
  const [demoUserCases, realCasesToRequeue, realCasesDone] = await Promise.all([
    prisma.case.count({ where: { userId: { in: userIds } } }),
    prisma.case.findMany({
      where: { doctorId: { in: doctorIds }, userId: { notIn: userIds }, status: { in: ['ASSIGNED', 'IN_REVIEW'] } },
      select: { id: true },
    }),
    prisma.case.count({
      where: { doctorId: { in: doctorIds }, userId: { notIn: userIds }, status: { notIn: ['ASSIGNED', 'IN_REVIEW'] } },
    }),
  ]);

  const totalCases = await prisma.case.count();

  console.log(`[demo-data] mode: ${APPLY ? 'APPLY' : 'dry run'}${ALL_CASES ? ' + all cases' : ''}`);
  if (ALL_CASES) console.log(`[demo-data] ALL cases in the database (deleted): ${totalCases}`);
  console.log(`[demo-data] demo doctors found: ${doctors.length} (${doctors.map((d) => d.name).join(', ') || 'none'})`);
  console.log(`[demo-data] demo patients found: ${users.length} (${users.map((u) => u.name).join(', ') || 'none'})`);
  console.log(`[demo-data] demo patients' cases (deleted with them): ${demoUserCases}`);
  console.log(`[demo-data] real cases with a demo doctor, back to queue: ${realCasesToRequeue.length}`);
  console.log(`[demo-data] real finished cases with a demo doctor (kept, doctor cleared): ${realCasesDone}`);

  if (!APPLY) {
    console.log('[demo-data] nothing deleted. Run with --apply to delete.');
    return;
  }
  if (!doctors.length && !users.length && !(ALL_CASES && totalCases)) {
    console.log('[demo-data] no demo data left, nothing to do.');
    return;
  }

  const ownerIds = [...doctorIds, ...userIds];
  await prisma.$transaction([
    // Case children cascade (messages, solutions, history, ratings, video calls).
    ...(ALL_CASES
      ? [
          prisma.notification.deleteMany({ where: { caseId: { not: null } } }),
          prisma.case.deleteMany({}),
        ]
      : []),
    prisma.case.updateMany({
      where: { id: { in: realCasesToRequeue.map((c) => c.id) } },
      data: { status: 'PENDING' },
    }),
    prisma.notification.deleteMany({ where: { userId: { in: ownerIds } } }),
    prisma.deviceToken.deleteMany({ where: { ownerId: { in: ownerIds } } }),
    prisma.otpCode.deleteMany({ where: { phone: { in: DEMO_USER_PHONES } } }),
    prisma.user.deleteMany({ where: { id: { in: userIds } } }),
    prisma.doctor.deleteMany({ where: { id: { in: doctorIds } } }),
  ]);
  console.log(
    ALL_CASES
      ? '[demo-data] done: demo doctors, demo patients and ALL cases removed.'
      : '[demo-data] done: demo doctors, patients and their cases removed.'
  );
}

main()
  .catch((err) => {
    console.error('[demo-data] failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
