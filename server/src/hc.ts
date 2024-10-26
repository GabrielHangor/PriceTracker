import { apiRoutes } from "@/main.js";
import { hc } from "hono/client";

const client = hc<typeof apiRoutes>("");
export type Client = typeof client;

export const honoClient = (...args: Parameters<typeof hc>): Client => hc<typeof apiRoutes>(...args);
