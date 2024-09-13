import { createMiddleware } from "hono/factory";

const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;

export const cacheMiddleware = (maxAge = DAY, staleWhileRevalidate = HOUR) => {
  return createMiddleware(async (c, next) => {
    c.res.headers.set(
      "cache-control",
      `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    );

    await next();
  });
};
