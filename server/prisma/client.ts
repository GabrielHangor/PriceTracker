import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  errorFormat: "pretty",
  transactionOptions: { timeout: 30000 },
  log: ["warn", "error"],
});

export default prisma;
