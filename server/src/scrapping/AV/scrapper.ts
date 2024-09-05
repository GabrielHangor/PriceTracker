import { fetchAVProducts } from "@/scrapping/AV/fetcher.js";
import { createUrl } from "@/scrapping/AV/urlGenerator.js";
import { ScrappingError } from "@/errors/errors.js";
import type { ProductSummary } from "@/scrapping/types.js";
import { ProductCategoryEnum } from "@/types.js";
import { chromium } from "playwright";

const NUMBER_OF_PAGES = 5;

async function scrapeCategory(category: ProductCategoryEnum): Promise<ProductSummary[]> {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  });

  await page.goto("https://av.ru", { waitUntil: "domcontentloaded" });

  const allProducts: ProductSummary[] = [];

  for (let i = 0; i <= NUMBER_OF_PAGES; i++) {
    const url = createUrl({ category, page: i });

    const data = await page.evaluate(fetchAVProducts, { url, category });
    allProducts.push(...data);
  }

  await browser.close();

  return allProducts;
}

export default async function scrapeAVProducts() {
  const categories = [
    ProductCategoryEnum.CHEESE,
    ProductCategoryEnum.BIRD,
    ProductCategoryEnum.MEAT,
    ProductCategoryEnum.BAKERY,
    ProductCategoryEnum.MILK,
    ProductCategoryEnum.EGGS,
    ProductCategoryEnum.VEGETABLES,
    ProductCategoryEnum.FRUITS,
  ];

  const allProducts: ProductSummary[] = [];

  try {
    const products = (await Promise.all(categories.map(scrapeCategory))).flat();
    allProducts.push(...products);
  } catch (error) {
    if (error instanceof Error) {
      throw new ScrappingError(error.message, error.stack, error);
    }
  }

  return allProducts;
}
