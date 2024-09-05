import { ProductCategoryEnum } from "@/types.js";

const BASE_URL = "https://av.ru/category/all?q=%3Aacbestseller";
const PAGE_SIZE = 50;
const PRICE_RANGE = "%3AdynamicPriceValueSort%3A%5B0+TO+2000%5D"; // 0-2000

type ABQueryParams = {
  pageSize?: number;
  page?: number;
  priceRange?: string;
  category: ProductCategoryEnum;
};

const categoryQueryParams: Record<ProductCategoryEnum, string> = {
  [ProductCategoryEnum.CHEESE]: "syry",
  [ProductCategoryEnum.BIRD]: "myaso-i-ptitsa%2Fptitsa",
  [ProductCategoryEnum.MEAT]: "myaso-i-ptitsa%2Fmyaso-ohlazhdennoe",
  [ProductCategoryEnum.BAKERY]: "bulochnaya-pekarnya%2Fhleb-bulochki-lepeshki",
  [ProductCategoryEnum.MILK]: "moloko-yaytso-maslo%2Fmoloko-slivki%2Fmoloko",
  [ProductCategoryEnum.EGGS]: "moloko-yaytso-maslo%2Fyaytso",
  [ProductCategoryEnum.VEGETABLES]: "ovoschi-frukty-yagody%2Fovoschi",
  [ProductCategoryEnum.FRUITS]: "ovoschi-frukty-yagody%2Ffrukty",
};

export function createUrl(params: ABQueryParams): string {
  const { pageSize = PAGE_SIZE, page = 0, priceRange = PRICE_RANGE, category } = params;
  const categoryParam = categoryQueryParams[category];

  return `${BASE_URL}${priceRange}%3AcategoryUrl%3A%2F${categoryParam}&pageSize=${pageSize}&page=${page}`;
}
