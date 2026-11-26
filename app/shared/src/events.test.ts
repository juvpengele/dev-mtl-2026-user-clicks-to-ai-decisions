import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applySchema, seedDatabase } from "./database";
import {
  getEventsWithSeatsLeft,
  getEventsWithSeatsLeftOptimized,
  loadEvents,
} from "./events";
import type { DatabaseClient, QueryParameters } from "./types";

let sqlite: Database.Database;
let db: DatabaseClient;

beforeEach(() => {
  sqlite = new Database(":memory:");
  applySchema(sqlite);
  sqlite.prepare("INSERT INTO events (title, date, capacity) VALUES (?, ?, ?)").run(
    "Test event",
    "2030-01-01T18:00:00.000Z",
    10,
  );
  sqlite.prepare("INSERT INTO reservations (event_id, created_at) VALUES (1, ?)").run(
    "2029-12-01T12:00:00.000Z",
  );
  db = {
    all: async <T>(sql: string, parameters: QueryParameters = []) =>
      sqlite.prepare(sql).all(...parameters) as T[],
    get: async <T>(sql: string, parameters: QueryParameters = []) =>
      sqlite.prepare(sql).get(...parameters) as T | undefined,
  };
});

afterEach(() => sqlite.close());

describe.each([
  ["n_plus_one", getEventsWithSeatsLeft],
  ["optimized", getEventsWithSeatsLeftOptimized],
] as const)("%s event query", (_mode, query) => {
  it("returns the same correct seat count", async () => {
    await expect(query(db)).resolves.toEqual([
      expect.objectContaining({ title: "Test event", capacity: 10, seatsLeft: 9 }),
    ]);
  });
});

it.each(["n_plus_one", "optimized"] as const)(
  "loadEvents passes in %s mode",
  async (mode) => {
    const [event] = await loadEvents(db, mode);
    expect(event.seatsLeft).toBe(9);
  },
);

it("seeds rich events through January 2027", () => {
  const seeded = new Database(":memory:");
  try {
    seedDatabase(seeded);
    const summary = seeded.prepare(`
      SELECT
        COUNT(*) AS total,
        MAX(date) AS lastDate,
        SUM(CASE WHEN format = 'online' THEN 1 ELSE 0 END) AS onlineEvents,
        COUNT(DISTINCT city) AS cities,
        SUM(CASE WHEN speaker = '' OR description = '' THEN 1 ELSE 0 END) AS missingDetails
      FROM events
    `).get() as {
      total: number;
      lastDate: string;
      onlineEvents: number;
      cities: number;
      missingDetails: number;
    };

    expect(summary.total).toBe(150);
    expect(summary.lastDate.startsWith("2027-01-31T")).toBe(true);
    expect(summary.onlineEvents).toBeGreaterThan(0);
    expect(summary.cities).toBeGreaterThan(3);
    expect(summary.missingDetails).toBe(0);
  } finally {
    seeded.close();
  }
});
