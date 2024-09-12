-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceChange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "minPrice" DECIMAL NOT NULL,
    "maxPrice" DECIMAL NOT NULL,
    "timeRange" TEXT NOT NULL,
    "deltaPercent" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceChange_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PriceChange" ("deltaPercent", "id", "maxPrice", "minPrice", "productId", "timeRange", "updatedAt") SELECT "deltaPercent", "id", "maxPrice", "minPrice", "productId", "timeRange", "updatedAt" FROM "PriceChange";
DROP TABLE "PriceChange";
ALTER TABLE "new_PriceChange" RENAME TO "PriceChange";
CREATE UNIQUE INDEX "PriceChange_productId_timeRange_key" ON "PriceChange"("productId", "timeRange");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
