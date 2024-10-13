import type { AppType } from "server/src/main";
import { hc } from "hono/client";

const client = hc<AppType>("/");

export default client;
