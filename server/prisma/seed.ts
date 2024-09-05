import prisma from "prisma/client.js";

async function main() {
  await prisma.productCategory.createMany({
    data: [
      { id: 1, name: "Сыр" },
      { id: 2, name: "Птица" },
      { id: 3, name: "Мясо" },
      { id: 4, name: "Выпечка" },
      { id: 5, name: "Молоко" },
      { id: 6, name: "Яйца" },
      { id: 7, name: "Овощи" },
      { id: 8, name: "Фкрукты" },
    ],
  });

  await prisma.seller.createMany({ data: [{ id: 1, name: "AV" }] });
}

main().catch((e) => console.error(e));
