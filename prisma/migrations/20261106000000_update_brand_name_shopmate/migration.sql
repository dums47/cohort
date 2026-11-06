ALTER TABLE "StoreConfig"
ALTER COLUMN "brandName" SET DEFAULT 'ShopMate';

UPDATE "StoreConfig"
SET "brandName" = 'ShopMate'
WHERE "brandName" IN ('Naturalsearch', 'Shopmate AI');
