/*
  Warnings:

  - You are about to drop the column `maxPrice` on the `PriceChange` table. All the data in the column will be lost.
  - You are about to drop the column `minPrice` on the `PriceChange` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceChange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "previousPrice" DECIMAL NOT NULL DEFAULT 0,
    "currentPrice" DECIMAL NOT NULL DEFAULT 0,
    "timeRange" TEXT NOT NULL,
    "deltaPercent" DECIMAL NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceChange_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PriceChange" ("deltaPercent", "id", "productId", "timeRange", "updatedAt") SELECT "deltaPercent", "id", "productId", "timeRange", "updatedAt" FROM "PriceChange";
DROP TABLE "PriceChange";
ALTER TABLE "new_PriceChange" RENAME TO "PriceChange";
CREATE UNIQUE INDEX "PriceChange_productId_timeRange_key" ON "PriceChange"("productId", "timeRange");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
