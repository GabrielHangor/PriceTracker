import type { ProductCategoryEnum, SellerEnum } from "@/types.js";


export type ProductSummary = {
  code: string;
  name: string;
  manufacturer?: string;
  price: number;
  imageUrl: string;
  description?: string;
  categoryId: ProductCategoryEnum;
  sellerId: SellerEnum;
};
