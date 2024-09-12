import { ProductCategoryEnum, SellerEnum } from "@/types.js";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  pageSize: z.coerce.number().max(50).optional().default(20),
  categoryId: z
    .string()
    .transform((id) => Number(id))
    .pipe(z.nativeEnum(ProductCategoryEnum, { message: "Invalid category ID" }))
    .optional(),
  sellerId: z
    .string()
    .transform((id) => Number(id))
    .pipe(z.nativeEnum(SellerEnum, { message: "Invalid Seller ID" }))
    .optional(),
});
