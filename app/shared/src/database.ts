import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sharedDirectory = join(dirname(fileURLToPath(import.meta.url)), "..");
export const defaultDatabasePath = join(sharedDirectory, "project-x.sqlite");

export function openDatabase(path = process.env.DATABASE_PATH ?? defaultDatabasePath) {
  const database = new Database(path);
  database.pragma("foreign_keys = ON");
  return database;
}

export function applySchema(database: Database.Database) {
  database.exec(readFileSync(join(sharedDirectory, "schema.sql"), "utf8"));
}

function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

export function seedDatabase(database: Database.Database) {
  applySchema(database);
  const existing = database.prepare("SELECT COUNT(*) AS count FROM events").get() as {
    count: number;
  };
  if (existing.count > 0) return false;

  const random = createRandom(20251113);
  const topics = [
    "Observable Systems",
    "AI Engineering",
    "React at Scale",
    "Cloud Native Night",
    "TypeScript Deep Dive",
    "Platform Engineering",
    "Data & Decisions",
    "Open Source Meetup",
  ];
  const places = ["Montréal", "Toronto", "Ottawa", "Québec", "Online"];
  const baseDate = new Date();
  baseDate.setUTCHours(18, 0, 0, 0);

  const insertEvent = database.prepare(
    "INSERT INTO events (title, date, capacity) VALUES (?, ?, ?)",
  );
  const insertReservation = database.prepare(
    "INSERT INTO reservations (event_id, created_at) VALUES (?, ?)",
  );

  database.transaction(() => {
    for (let index = 0; index < 150; index += 1) {
      const date = new Date(baseDate);
      date.setUTCDate(baseDate.getUTCDate() + index + 1);
      const capacity = 40 + Math.floor(random() * 161);
      const title = `${topics[index % topics.length]} · ${places[index % places.length]}`;
      const result = insertEvent.run(title, date.toISOString(), capacity);
      const reserved = Math.floor(random() * Math.min(capacity, 90));
      for (let reservation = 0; reservation < reserved; reservation += 1) {
        insertReservation.run(Number(result.lastInsertRowid), new Date().toISOString());
      }
    }
  })();

  return true;
}

export function resetDatabase(database: Database.Database) {
  applySchema(database);
  database.transaction(() => {
    database.prepare("DELETE FROM reservations").run();
    database.prepare("DELETE FROM events").run();
    database.prepare("DELETE FROM sqlite_sequence WHERE name IN ('events', 'reservations')").run();
  })();
  seedDatabase(database);
}
