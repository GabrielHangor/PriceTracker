import { DbPopulatingError } from "@/errors/errors.js";
import { TimeRange } from "@/types.js";
import type { PriceHistory, Product } from "@prisma/client";
import prisma from "prisma/client.js";

export async function updatePriceChanges() {
  try {
    await prisma.$transaction(async (prisma) => {
      const products: Product[] = await prisma.product.findMany();

      for (const product of products) {
        const priceHistory = await prisma.priceHistory.findMany({
          where: { productId: product.id },
          orderBy: { date: "desc" },
        });

        const now = new Date();

        const oneDayAgo = new Date(now);
        oneDayAgo.setDate(now.getDate() - 1);

        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const dailyChange = calculateChange(priceHistory, oneDayAgo);
        const weeklyChange = calculateChange(priceHistory, oneWeekAgo);
        const monthlyChange = calculateChange(priceHistory, oneMonthAgo);
        const totalChange = calculateChange(priceHistory, new Date(0));

        await prisma.priceChange.upsert({
          where: { productId_timeRange: { productId: product.id, timeRange: TimeRange.DAILY } },
          update: dailyChange,
          create: { ...dailyChange, productId: product.id, timeRange: TimeRange.DAILY },
        });

        await prisma.priceChange.upsert({
          where: { productId_timeRange: { productId: product.id, timeRange: TimeRange.WEEKLY } },
          update: weeklyChange,
          create: { ...weeklyChange, productId: product.id, timeRange: TimeRange.WEEKLY },
        });

        await prisma.priceChange.upsert({
          where: { productId_timeRange: { productId: product.id, timeRange: TimeRange.MONTHLY } },
          update: monthlyChange,
          create: { ...monthlyChange, productId: product.id, timeRange: TimeRange.MONTHLY },
        });

        await prisma.priceChange.upsert({
          where: { productId_timeRange: { productId: product.id, timeRange: TimeRange.TOTAL } },
          update: totalChange,
          create: { ...totalChange, productId: product.id, timeRange: TimeRange.TOTAL },
        });
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new DbPopulatingError("Error occurred while updating price changes in database", e);
    }
  }
}

function calculateChange(priceHistory: PriceHistory[], since: Date) {
  const filteredHistory = priceHistory.filter((entry) => entry.date >= since);

  if (filteredHistory.length === 0) {
    return { minPrice: 0, maxPrice: 0, deltaPercent: 0 };
  }

  const prices = filteredHistory.map((entry) => entry.price.toNumber());
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const deltaPercent = ((maxPrice - minPrice) / minPrice) * 100;

  return {
    minPrice,
    maxPrice,
    deltaPercent: deltaPercent.toFixed(2),
  };
}
