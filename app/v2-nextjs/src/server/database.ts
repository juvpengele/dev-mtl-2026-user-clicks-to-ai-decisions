import { trace } from "@opentelemetry/api";
import type { DatabaseClient, QueryParameters } from "@project-x/shared";
import {
  applySchema,
  defaultDatabasePath,
  openDatabase,
  seedDatabase,
} from "@project-x/shared/database";
import type Database from "better-sqlite3";

declare global {
  var projectXDatabase: Database.Database | undefined;
}

function databasePath() {
  return process.env.DATABASE_PATH ?? defaultDatabasePath;
}

function getDatabase() {
  if (!globalThis.projectXDatabase) {
    const database = openDatabase(databasePath());
    applySchema(database);
    seedDatabase(database);
    globalThis.projectXDatabase = database;
  }
  return globalThis.projectXDatabase;
}

function operationName(sql: string) {
  return sql.trim().split(/\s+/, 1)[0]?.toUpperCase() ?? "QUERY";
}

async function simulateLatency() {
  const milliseconds = Number(process.env.SIMULATED_DB_LATENCY_MS ?? 0);
  if (Number.isFinite(milliseconds) && milliseconds > 0) {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}

async function query<T>(
  kind: "all" | "get" | "run",
  sql: string,
  parameters: QueryParameters = [],
): Promise<T> {
  const operation = operationName(sql);
  return trace.getTracer("project-x-db").startActiveSpan(
    `db.${operation.toLowerCase()} events`,
    {
      attributes: {
        "db.system.name": "sqlite",
        "db.operation.name": operation,
        "db.query.text": sql.replace(/\s+/g, " ").trim(),
        "db.namespace": databasePath(),
      },
    },
    async (span) => {
      try {
        await simulateLatency();
        const statement = getDatabase().prepare(sql);
        const result =
          kind === "all"
            ? statement.all(...parameters)
            : kind === "get"
              ? statement.get(...parameters)
              : statement.run(...parameters);
        const rowCount = Array.isArray(result)
          ? result.length
          : kind === "get"
            ? result == null
              ? 0
              : 1
            : Number((result as Database.RunResult).changes);
        span.setAttribute("db.response.returned_rows", rowCount);
        return result as T;
      } catch (error) {
        span.recordException(error as Error);
        throw error;
      } finally {
        span.end();
      }
    },
  );
}

export const tracedDb: DatabaseClient = {
  all: <T>(sql: string, parameters?: QueryParameters) =>
    query<T[]>("all", sql, parameters),
  get: <T>(sql: string, parameters?: QueryParameters) =>
    query<T | undefined>("get", sql, parameters),
};

export function run(sql: string, parameters?: QueryParameters) {
  return query<Database.RunResult>("run", sql, parameters);
}
