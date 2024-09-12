import categories from "@/endpoints/categories/caregories.js";
import changes from "@/endpoints/changes/changes.js";
import products from "@/endpoints/products/products.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";

const app = new Hono();

app.use(compress());

const apiRoutes = app
  .basePath("/api")
  .route("/categories", categories)
  .route("/products", products)
  .route("/changes", changes);

console.log(`Server is running on port ${process.env.PORT || 3000}`);

serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});

export type AppType = typeof apiRoutes;
