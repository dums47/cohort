ALTER TABLE "ApiKey"
ADD COLUMN "publicKey" TEXT;

CREATE UNIQUE INDEX "ApiKey_publicKey_key" ON "ApiKey"("publicKey");
