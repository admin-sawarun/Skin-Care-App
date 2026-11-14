-- CreateEnum
CREATE TYPE "DoctorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "status" "DoctorStatus" NOT NULL DEFAULT 'APPROVED';
