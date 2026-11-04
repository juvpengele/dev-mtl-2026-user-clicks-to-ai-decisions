import { openDatabase, resetDatabase, seedDatabase } from "../src/database";

const command = process.argv[2];
const database = openDatabase();

try {
  if (command === "reset") {
    resetDatabase(database);
    console.log("Reset complete: 150 events seeded.");
  } else if (command === "seed") {
    const seeded = seedDatabase(database);
    console.log(seeded ? "Seed complete: 150 events created." : "Seed skipped: database is not empty.");
  } else {
    throw new Error("Usage: tsx scripts/database.ts <seed|reset>");
  }
} finally {
  database.close();
}
