import categories from "@/endpoints/categories/index.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const routes = app.route("/categories", categories);

console.log(`Server is running on port ${process.env.PORT || 3000}`);

serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});

export type AppType = typeof routes;
