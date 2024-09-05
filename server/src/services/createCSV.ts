import { createObjectCsvWriter } from "csv-writer";
import type { ObjectMap } from "csv-writer/src/lib/lang/object.js";

interface CSVWriterOptions<T> {
  filePath: string;
  data: T[];
}

export async function createCSV<T extends ObjectMap<any>>(options: CSVWriterOptions<T>): Promise<void> {
  const { filePath, data } = options;

  if (data.length === 0) {
    throw new Error("Data is empty");
  }

  const headers = Object.keys(data[0]).map((key) => ({ id: key, title: key }));

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: headers,
  });

  try {
    await csvWriter.writeRecords(data);
    console.log(`Data has been written to ${filePath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to write data to CSV: ${error.message}`);
    } else {
      console.error(`Failed to write data to CSV: ${String(error)}`);
    }
    throw error;
  }
}
