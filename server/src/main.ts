import categories from "@/endpoints/categories/index.js";
import products from "@/endpoints/products/index.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";

const app = new Hono();

app.use(compress());

const routes = app.route("/categories", categories).route("/products", products);

console.log(`Server is running on port ${process.env.PORT || 3000}`);

serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});

export type AppType = typeof routes;
