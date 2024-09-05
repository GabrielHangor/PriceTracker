import scrapeAVProducts from "@/scrapping/AV/scrapper.js";

export async function scrapeAllProducts() {
  const products = await scrapeAVProducts();

  return products;
}
