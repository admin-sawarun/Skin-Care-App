-- CreateEnum
CREATE TYPE "AccountDeletionStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "AccountDeletionRequest" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "reason" TEXT,
    "status" "AccountDeletionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "AccountDeletionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountDeletionRequest_status_idx" ON "AccountDeletionRequest"("status");
