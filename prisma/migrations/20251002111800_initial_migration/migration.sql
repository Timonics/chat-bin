-- CreateTable
CREATE TABLE "Secret" (
    "id" SERIAL NOT NULL,
    "encryptedText" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "remainingViews" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openedAt" TIMESTAMP(3),

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Secret_accessToken_key" ON "Secret"("accessToken");
