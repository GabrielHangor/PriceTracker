-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PriceHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DECIMAL NOT NULL,
    CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PriceHistory" ("date", "id", "price", "productId") SELECT "date", "id", "price", "productId" FROM "PriceHistory";
DROP TABLE "PriceHistory";
ALTER TABLE "new_PriceHistory" RENAME TO "PriceHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
