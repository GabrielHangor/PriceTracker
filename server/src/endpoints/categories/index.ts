import { Hono } from "hono";
import prisma from "prisma/client.js";

const app = new Hono().get("/", async (c) => {
  const categories = await prisma.productCategory.findMany();

  return c.json(categories);
});

export default app;
