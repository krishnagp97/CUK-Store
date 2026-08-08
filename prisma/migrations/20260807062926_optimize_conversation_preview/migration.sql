-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "lastMessage" TEXT,
ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "lastSenderId" TEXT;

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");

-- CreateIndex
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");
