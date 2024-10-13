import { changesQuerySchema, changesTimeRangeQuerySchema } from "@/endpoints/changes/validation.js";
import { PaginatedItems } from "@/utils/PaginatedItems.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import prisma from "prisma/client.js";

const changesRouter = new Hono()
  .get("/filters", zValidator("query", changesTimeRangeQuerySchema), async (c) => {
    const { range } = c.req.valid("query");

    const [categories, seller, minPriceAggregation, maxPriceAggregation, deltaPercentAggregation] =
      await prisma.$transaction([
        prisma.productCategory.findMany(),
        prisma.seller.findMany(),

        prisma.priceChange.aggregate({
          where: { timeRange: range, deltaPercent: { not: 0 } },
          _min: { previousPrice: true },
          _max: { previousPrice: true },
        }),

        prisma.priceChange.aggregate({
          where: { timeRange: range, deltaPercent: { not: 0 } },
          _min: { currentPrice: true },
          _max: { currentPrice: true },
        }),

        prisma.priceChange.aggregate({
          where: { timeRange: range, deltaPercent: { not: 0 } },
          _min: { deltaPercent: true },
          _max: { deltaPercent: true },
        }),
      ]);

    const previousPrice = {
      min: minPriceAggregation._min.previousPrice?.toNumber(),
      max: minPriceAggregation._max.previousPrice?.toNumber(),
    };

    const currentPrice = {
      min: maxPriceAggregation._min.currentPrice?.toNumber(),
      max: maxPriceAggregation._max.currentPrice?.toNumber(),
    };

    const deltaPercent = {
      min: deltaPercentAggregation._min.deltaPercent?.toNumber(),
      max: deltaPercentAggregation._max.deltaPercent?.toNumber(),
    };

    return c.json({ categories, seller, previousPrice, currentPrice, deltaPercent });
  })
  .get("/", zValidator("query", changesQuerySchema), async (c) => {
    const { range, page, pageSize, sortField, sortOrder, filters } = c.req.valid("query");

    const { categoryId, sellerId, deltaPercent, currentPrice, previousPrice } = filters;

    const orderByClause = sortField && sortOrder ? { [sortField]: sortOrder } : undefined;

    const whereClause = {
      timeRange: range,
      deltaPercent: deltaPercent ? { gte: deltaPercent.gte, lte: deltaPercent.lte } : { not: 0 },
      product: { categoryId, sellerId },
      previousPrice,
      currentPrice,
    };

    const getChangesQuery = prisma.priceChange.findMany({
      orderBy: orderByClause ?? { deltaPercent: "desc" },
      where: whereClause,
      include: {
        product: {
          select: { name: true, imageUrl: true, category: true, seller: { select: { name: true } } },
        },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const [productPriceChanges, totalPerQuery, increases, reductions] = await prisma.$transaction([
      getChangesQuery,
      prisma.priceChange.count({ where: whereClause }),
      prisma.priceChange.count({ where: { timeRange: range, deltaPercent: { gt: 0 } } }),
      prisma.priceChange.count({ where: { timeRange: range, deltaPercent: { lt: 0 } } }),
    ]);

    const changesWithCount = {
      productPriceChanges: new PaginatedItems(productPriceChanges, totalPerQuery, page, pageSize),
      increases,
      reductions,
    };

    return c.json(changesWithCount);
  });
// .get(
//   "/:productId",
//   zValidator("query", changesQuerySchema),
//   zValidator("param", productChangesParamSchema),
//   async (c) => {
//     const { productId } = c.req.valid("param");
//     const { range } = c.req.valid("query");

//     const changes = await prisma.priceChange.findMany({
//       where: { timeRange: range, productId, deltaPercent: { not: 0 } },
//       include: {
//         product: {
//           select: { name: true, imageUrl: true, category: true, seller: { select: { name: true } } },
//         },
//       },
//     });

//     return c.json(changes);
//   },
// );

export default changesRouter;
