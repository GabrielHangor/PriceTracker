/*
  Warnings:

  - You are about to drop the column `daysRange` on the `PriceChange` table. All the data in the column will be lost.
  - Added the required column `timeRange` to the `PriceChange` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceChange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "minPrice" DECIMAL NOT NULL,
    "maxPrice" DECIMAL NOT NULL,
    "timeRange" TEXT NOT NULL,
    "deltaPercent" DECIMAL NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceChange_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PriceChange" ("deltaPercent", "id", "maxPrice", "minPrice", "productId") SELECT "deltaPercent", "id", "maxPrice", "minPrice", "productId" FROM "PriceChange";
DROP TABLE "PriceChange";
ALTER TABLE "new_PriceChange" RENAME TO "PriceChange";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
