import { DbPopulatingError } from "@/errors/errors.js";
import { TimeRange } from "@/types.js";
import type { Product } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";
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

export function calculateChange(priceHistory: { date: Date; price: Decimal }[], since: Date) {
  const sortedHistory = priceHistory.toSorted((a, b) => a.date.getTime() - b.date.getTime());
  const filteredHistory = sortedHistory.filter((entry) => entry.date >= since);

  if (filteredHistory.length === 0) {
    return { previousPrice: 0, currentPrice: 0, deltaPercent: 0 };
  }

  const currentPrice = sortedHistory[sortedHistory.length - 1].price.toNumber();
  const previousPrice = filteredHistory[0].price.toNumber();

  if (previousPrice === 0) {
    return { previousPrice, currentPrice, deltaPercent: 0 };
  }

  const deltaPercent = ((currentPrice - previousPrice) / previousPrice) * 100;

  return {
    previousPrice,
    currentPrice,
    deltaPercent: parseFloat(deltaPercent.toFixed(2)),
  };
}
