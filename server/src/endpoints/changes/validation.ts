import { ProductCategoryEnum, SellerEnum, TimeRange } from "@/types.js";
import { z } from "zod";

export const productChangesParamSchema = z.object({ productId: z.coerce.number() });

export const changesTimeRangeQuerySchema = z.object({
  range: z.nativeEnum(TimeRange, { message: "Invalid price range" }),
});

const filterSchema = z.object({
  previousPrice: z.number().optional(),
  currentPrice: z.number().optional(),
  deltaPercent: z
    .array(z.number())
    .refine((arr) => arr.length === 2, {
      message: "deltaPercent array must contain exactly 2 numbers",
    })
    .optional()
    .transform((val) => (val?.length ? { gte: val[0], lte: val[1] } : undefined)),
  categoryId: z.nativeEnum(ProductCategoryEnum, { message: "Invalid category ID" }).optional(),
  sellerId: z.nativeEnum(SellerEnum, { message: "Invalid Seller ID" }).optional(),
});

export const changesQuerySchema = z.object({
  range: z.nativeEnum(TimeRange, { message: "Invalid price range" }),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().max(50).default(10),
  sortField: z.string().optional(),
  sortOrder: z.coerce
    .number()
    .min(-1)
    .max(1)
    .optional()
    .transform((val) => (val === 1 ? "asc" : "desc")),
  filters: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, filterSchema),
});
