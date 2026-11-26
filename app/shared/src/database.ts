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

  const columns = new Set(
    (database.prepare("PRAGMA table_info(events)").all() as Array<{ name: string }>).map(
      ({ name }) => name,
    ),
  );
  const migrations = [
    ["city", "ALTER TABLE events ADD COLUMN city TEXT NOT NULL DEFAULT 'Montréal'"],
    [
      "format",
      "ALTER TABLE events ADD COLUMN format TEXT NOT NULL DEFAULT 'in_person' CHECK (format IN ('in_person', 'online'))",
    ],
    [
      "speaker",
      "ALTER TABLE events ADD COLUMN speaker TEXT NOT NULL DEFAULT 'Project X Guest'",
    ],
    [
      "description",
      "ALTER TABLE events ADD COLUMN description TEXT NOT NULL DEFAULT 'A practical technology session for builders and curious minds.'",
    ],
  ] as const;

  for (const [column, sql] of migrations) {
    if (!columns.has(column)) database.exec(sql);
  }
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
    "Observable Systems in Practice",
    "AI Engineering Without the Hype",
    "React at Scale",
    "Cloud Native Montréal",
    "TypeScript Deep Dive",
    "Platform Engineering Exchange",
    "Data, Signals & Decisions",
    "Open Source After Hours",
    "Designing Reliable APIs",
    "The Modern Web Runtime",
    "Responsible AI Systems",
    "Developer Experience Lab",
    "Security for Product Teams",
    "From Prototype to Production",
    "Distributed Systems Stories",
  ];
  const cities = ["Montréal", "Toronto", "Ottawa", "Québec City", "Vancouver"];
  const speakers = [
    "Maya Chen",
    "Noah Tremblay",
    "Amara Okafor",
    "Liam Patel",
    "Sofia Rossi",
    "Ethan Williams",
    "Camille Roy",
    "Lucas Martin",
    "Priya Shah",
    "Owen Clarke",
    "Nadia Benali",
    "Alex Kim",
  ];
  const descriptions = [
    "A practical session with architecture patterns, production lessons, and techniques you can apply the next morning.",
    "An honest conversation about the trade-offs teams encounter when promising ideas meet real users and real systems.",
    "A hands-on tour of the tools, decisions, and small operational habits that help software teams move with confidence.",
    "Stories from the field, including what failed, what changed, and the signals that finally made the problem understandable.",
    "A clear, example-driven talk for engineers and product leaders who want better decisions without unnecessary complexity.",
  ];
  const firstEvent = Date.parse("2026-09-05T14:00:00.000Z");
  const lastEvent = Date.parse("2027-01-31T20:00:00.000Z");
  const eventCount = 150;

  const insertEvent = database.prepare(
    `INSERT INTO events
      (title, date, capacity, city, format, speaker, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertReservation = database.prepare(
    "INSERT INTO reservations (event_id, created_at) VALUES (?, ?)",
  );

  database.transaction(() => {
    for (let index = 0; index < eventCount; index += 1) {
      const progress = index / (eventCount - 1);
      const date = new Date(firstEvent + Math.round((lastEvent - firstEvent) * progress));
      date.setUTCHours([14, 18, 20][index % 3], 0, 0, 0);
      const capacity = 40 + Math.floor(random() * 161);
      const format = index % 4 === 0 ? "online" : "in_person";
      const city = format === "online" ? "Online" : cities[index % cities.length];
      const result = insertEvent.run(
        topics[index % topics.length],
        date.toISOString(),
        capacity,
        city,
        format,
        speakers[index % speakers.length],
        descriptions[index % descriptions.length],
      );
      const reserved = Math.floor(random() * Math.min(capacity, 90));
      for (let reservation = 0; reservation < reserved; reservation += 1) {
        insertReservation.run(
          Number(result.lastInsertRowid),
          new Date(date.getTime() - (reservation + 1) * 86_400_000).toISOString(),
        );
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
