import { productChangesParamSchema, changesQuerySchema } from "@/endpoints/changes/validation.js";
import { cacheMiddleware } from "@/middlewares/cache.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import prisma from "prisma/client.js";

const changesRouter = new Hono()
  .get("/", cacheMiddleware(), zValidator("query", changesQuerySchema), async (c) => {
    const { range } = c.req.valid("query");

    const getChangesQuery = prisma.priceChange.findMany({
      where: { timeRange: range, deltaPercent: { not: 0 } },
      orderBy: { deltaPercent: "desc" },
      include: {
        product: {
          select: { name: true, imageUrl: true, category: true, seller: { select: { name: true } } },
        },
      },
      take: 20,
    });

    const [changes, increases, reductions] = await prisma.$transaction([
      getChangesQuery,
      prisma.priceChange.count({ where: { timeRange: range, deltaPercent: { gt: 0 } } }),
      prisma.priceChange.count({ where: { timeRange: range, deltaPercent: { lt: 0 } } }),
    ]);

    const changesWithCount = { changes, increases, reductions };

    return c.json(changesWithCount);
  })
  .get(
    "/:productId",
    cacheMiddleware(),
    zValidator("query", changesQuerySchema),
    zValidator("param", productChangesParamSchema),
    async (c) => {
      const { productId } = c.req.valid("param");
      const { range } = c.req.valid("query");

      const changes = await prisma.priceChange.findMany({
        where: { timeRange: range, productId, deltaPercent: { not: 0 } },
        include: {
          product: {
            select: { name: true, imageUrl: true, category: true, seller: { select: { name: true } } },
          },
        },
      });

      return c.json(changes);
    },
  );

export default changesRouter;
