-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_category_idx" ON "Feedback"("category");

-- CreateIndex
CREATE INDEX "Feedback_rating_idx" ON "Feedback"("rating");

-- CreateIndex
CREATE INDEX "Feedback_sentiment_idx" ON "Feedback"("sentiment");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");
