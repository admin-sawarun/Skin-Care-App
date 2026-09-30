-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Retroactively marks the originally-seeded admin as the super admin, so
-- this takes effect on every already-deployed database (this project's and
-- the client's) without needing a manual reseed.
UPDATE "Admin" SET "isSuperAdmin" = true WHERE "email" = 'admin@skincareapp.com';
