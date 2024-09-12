import { TimeRange } from "@/types.js";
import { z } from "zod";

export const productChangesParamSchema = z.object({ productId: z.coerce.number() });

export const changesQuerySchema = z.object({
  range: z.nativeEnum(TimeRange, { message: "Invalid price range" }),
});
