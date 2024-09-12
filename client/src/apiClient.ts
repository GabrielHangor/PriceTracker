import type { AppType } from "../../server/src/main.js";
import { hc } from "hono/client";

const client = hc<AppType>("");

export default client;
