/*
  Warnings:

  - A unique constraint covering the columns `[productId,timeRange]` on the table `PriceChange` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PriceChange_productId_timeRange_key" ON "PriceChange"("productId", "timeRange");
