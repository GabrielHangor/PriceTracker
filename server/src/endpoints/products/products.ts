import { productSchema } from "@/endpoints/products/validation.js";
import { PaginatedItems } from "@/utils/PaginatedItems.js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import prisma from "prisma/client.js";

const productsRouter = new Hono()
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { category: true, seller: true },
    });

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json(product);
  })
  .get("/", zValidator("query", productSchema), async (c) => {
    const { page, pageSize, categoryId, sellerId, name } = c.req.valid("query");

    const [products, count] = await prisma.$transaction([
      prisma.product.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
        include: { category: true, seller: true },
        where: { categoryId, sellerId, name: { contains: name } },
      }),

      prisma.product.count({ where: { categoryId, sellerId, name: { contains: name } } }),
    ]);

    return c.json(new PaginatedItems(products, count, page, pageSize));
  });

export default productsRouter;
