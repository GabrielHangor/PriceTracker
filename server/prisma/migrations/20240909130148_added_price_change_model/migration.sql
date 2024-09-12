-- CreateTable
CREATE TABLE "PriceChange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "minPrice" DECIMAL NOT NULL,
    "maxPrice" DECIMAL NOT NULL,
    "type" INTEGER NOT NULL,
    "deltaPercent" DECIMAL NOT NULL,
    "range" INTEGER NOT NULL,
    CONSTRAINT "PriceChange_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
