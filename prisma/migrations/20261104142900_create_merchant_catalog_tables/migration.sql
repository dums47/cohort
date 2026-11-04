CREATE TABLE IF NOT EXISTS "Merchant" (
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Merchant_pkey" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS "Merchant_email_key" ON "Merchant"(email);

CREATE TABLE IF NOT EXISTS "ApiKey" (
  id TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  prefix TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "lastUsedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApiKey_pkey" PRIMARY KEY (id),
  CONSTRAINT "ApiKey_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "ApiKey_keyHash_key" ON "ApiKey"("keyHash");
CREATE INDEX IF NOT EXISTS "ApiKey_merchantId_isActive_idx" ON "ApiKey"("merchantId", "isActive");

CREATE TABLE IF NOT EXISTS "StoreConfig" (
  id TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "primaryColor" TEXT NOT NULL DEFAULT '#6d5dfc',
  "widgetPosition" TEXT NOT NULL DEFAULT 'bottom-right',
  "brandName" TEXT NOT NULL DEFAULT 'Shopmate AI',
  CONSTRAINT "StoreConfig_pkey" PRIMARY KEY (id),
  CONSTRAINT "StoreConfig_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "StoreConfig_merchantId_key" ON "StoreConfig"("merchantId");
