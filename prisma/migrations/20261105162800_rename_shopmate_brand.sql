ALTER TABLE "StoreConfig"
ALTER COLUMN "brandName" SET DEFAULT 'Naturalsearch';

UPDATE "StoreConfig"
SET "brandName" = 'Naturalsearch'
WHERE "brandName" = 'Shopmate AI';
