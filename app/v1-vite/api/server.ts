import express from "express";
import {
  getEventsWithSeatsLeft,
  type DatabaseClient,
  type QueryParameters,
} from "@project-x/shared";
import {
  applySchema,
  openDatabase,
  seedDatabase,
} from "@project-x/shared/database";

const sqlite = openDatabase();
applySchema(sqlite);
seedDatabase(sqlite);

const latency = Number(process.env.SIMULATED_DB_LATENCY_MS ?? 13);
const wait = () =>
  Number.isFinite(latency) && latency > 0
    ? new Promise((resolve) => setTimeout(resolve, latency))
    : Promise.resolve();

const db: DatabaseClient = {
  async all<T>(sql: string, parameters: QueryParameters = []) {
    await wait();
    return sqlite.prepare(sql).all(...parameters) as T[];
  },
  async get<T>(sql: string, parameters: QueryParameters = []) {
    await wait();
    return sqlite.prepare(sql).get(...parameters) as T | undefined;
  },
};

const app = express();

app.get("/api/events", async (_request, response) => {
  response.json(await getEventsWithSeatsLeft(db));
});

app.listen(3001);
