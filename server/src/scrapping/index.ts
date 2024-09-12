import { DbPopulatingError, ScrappingError } from "@/errors/errors.js";
import { populateProducts } from "@/scrapping/populateProducts.js";
import { scrapeAllProducts } from "@/scrapping/scrapeProducts.js";
import { updatePriceChanges } from "@/scrapping/updatePriceChanges.js";
import EmailService from "@/services/EmailService.js";
import timerify from "@/utils/timerify.js";

async function sendNotification(subject: string, text: string) {
  await EmailService.sendEmail({ to: "gaba93@yandex.ru", subject, text });
}

export async function main() {
  try {
    const [products, scrapeAllProductsTimeTaken] = await timerify(scrapeAllProducts);
    const [, populateProductsTimeTaken] = await timerify(populateProducts, products);
    const [, updatePriceChangesTimeTaken] = await timerify(updatePriceChanges);

    await sendNotification(
      "Scraping products finished",
      `Scraping products finished in ${(scrapeAllProductsTimeTaken / 1000).toFixed(2)} seconds.
       \nPopulating products in database finished in ${(populateProductsTimeTaken / 1000).toFixed(2)} seconds.
       \nUpdating price changes finished in ${(updatePriceChangesTimeTaken / 1000).toFixed(2)} seconds.
       \nScraped and populated ${products.length} products`,
    );
  } catch (e) {
    const error = e as Error;

    let errorMessage = "An unknown error occurred";

    if (error instanceof ScrappingError) {
      errorMessage = "Error occurred while scraping products";
    } else if (error instanceof DbPopulatingError) {
      errorMessage = "Error occurred while populating products in database";
    }

    await sendNotification(errorMessage, error.toString());
  }
}

main();
