import { DbPopulatingError } from "@/errors/errors.js";
import type { ProductSummary } from "@/scrapping/types.js";
import prisma from "prisma/client.js";

function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function populateProducts(products: ProductSummary[]) {
  const today = getStartOfToday();

  try {
    await prisma.$transaction(async (prisma) => {
      const operations = products.map(async (product) => {
        const newProduct = await prisma.product.upsert({
          where: { code: product.code },
          update: {
            name: product.name,
            manufacturer: product.manufacturer,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId,
            description: product.description,
            sellerId: product.sellerId,
          },
          create: {
            code: product.code,
            name: product.name,
            manufacturer: product.manufacturer,
            imageUrl: product.imageUrl,
            description: product.description,
            categoryId: product.categoryId,
            sellerId: product.sellerId,
          },
        });

        const existingPriceHistory = await prisma.priceHistory.findFirst({
          where: {
            productId: newProduct.id,
            date: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // less than tomorrow
            },
          },
        });

        await prisma.priceHistory.upsert({
          where: { id: existingPriceHistory?.id || 0 },
          update: {
            price: product.price,
          },
          create: {
            productId: newProduct.id,
            price: product.price,
          },
        });
      });

      await Promise.all(operations);
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new DbPopulatingError("Error occurred while populating products in database", e);
    }
  }
}
