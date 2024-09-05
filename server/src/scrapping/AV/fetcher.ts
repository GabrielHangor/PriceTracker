import type { ProductSummary } from "@/scrapping/types.js";
import type { ProductCategoryEnum, SellerEnum } from "@/types.js";

export async function fetchAVProducts({ url, category }: { url: string; category: ProductCategoryEnum }) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error occured while scrapping AV products");
  }

  const json = (await response.json()) as any;

  const sellerId: SellerEnum = 1;

  const products = json.products.products.map((p: any) => ({
    code: p.code,
    name: p.name,
    manufacturer: p.manufacturer || undefined,
    price: p.unitPrice,
    description: p.description || undefined,
    imageUrl: p.images.length > 0 ? p.images[0].url : undefined,
    categoryId: category,
    sellerId,
  })) as ProductSummary[];

  return products;
}
