import { prisma } from "../src/lib/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "6db5e63d-8981-428e-9374-a8119ee3b66b",
      title: "United Summer",
      slug: "united-summer",
      details: "Um evento para dev's apaixonados por codigo",
      maximumAttendees: 120,
    },
  });
}

seed().then(() => {
  console.log("Seeded successfully");
  prisma.$disconnect();
});
