# Project X

Project X is the live demo for **“From User Clicks to AI Decisions: Full-Stack Observability with React & OpenTelemetry.”** It is an event-booking app with a natural-looking N+1 database query, end-to-end browser/server/database tracing, and a one-variable fix.

The repository deliberately contains only the observable version for now:

```text
shared/        SQLite schema, deterministic seed/reset, reusable event queries
v2-nextjs/     Next.js App Router app with OpenTelemetry
infra/         Azure Container Apps + Application Insights Bicep (prepare only)
v1-vite/       reserved for the next version of the demo; not created yet
```

## The story in three sentences

The browser starts a span around loading the event list or reserving a seat, and fetch instrumentation sends its `traceparent` to the Next.js API. The API calls telemetry-free shared event code through an injected database client that creates one span per SQLite query. `EVENTS_QUERY_MODE=n_plus_one` produces 151 database spans; `optimized` produces one and returns the same data.

## Requirements

- Node.js 22+
- Docker with Compose
- Optional for the Claude demo: [`uv`](https://docs.astral.sh/uv/) and Claude Code
- Optional for Azure preparation: Azure CLI, Bicep, and an Azure Container Registry

## Quick start

```bash
npm install
cp v2-nextjs/.env.example v2-nextjs/.env.local
npm run db:reset
docker compose up -d
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and Jaeger at [http://localhost:16686](http://localhost:16686).

The defaults in `.env.example` make the problem visible on a laptop:

```dotenv
EVENTS_QUERY_MODE=n_plus_one
SIMULATED_DB_LATENCY_MS=5
```

`SIMULATED_DB_LATENCY_MS` adds an artificial delay **to every query**. SQLite is in-process and normally too fast for a convincing waterfall; this setting transparently mimics the network latency of a production database. Set it to `0` to observe native SQLite timing.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run Next.js on port 3000 |
| `npm test` | Run the shared data tests and app configuration tests |
| `npm run build` | Create the standalone production build |
| `npm run db:seed` | Seed only when the database is empty |
| `npm run db:reset` | Safely clear only Project X rows and immediately reseed 150 events |
| `docker compose up -d` | Start the Collector and Jaeger |
| `docker compose down` | Stop local observability services |

The reset command never deletes a database file. It uses a transaction to clear the two known tables, resets their counters, and reseeds them, so it is safe and fast immediately before the talk.

## How the deliberate bug works

[`shared/src/events.ts`](shared/src/events.ts) holds both implementations behind the same interface:

- `getEventsWithSeatsLeft()` loads the 150 events, then performs one clean count query per event. This is the deliberate, plausible N+1 implementation.
- `getEventsWithSeatsLeftOptimized()` performs a single `LEFT JOIN` with `GROUP BY`.
- `loadEvents()` selects between them using `EVENTS_QUERY_MODE`; unknown or missing values intentionally default to `n_plus_one`.

The shared package imports no OpenTelemetry code. The Next.js app injects [`tracedDb`](v2-nextjs/src/server/database.ts), while the future Vite version can inject an ordinary client without changing shared code.

Every traced query records `db.system.name=sqlite`, `db.query.text`, `db.operation.name`, `db.response.returned_rows`, and the database path. The enclosing application span records `http.route`, `code.function.name`, event count, and query mode.

## Telemetry data flow

```text
Browser parent span
  → instrumented fetch with traceparent
    → Next.js request span
      → getEventsWithSeatsLeft span
        → one db span per query
          → OTLP/HTTP Collector
            → Jaeger (local) or Azure Monitor (cloud)
```

Server telemetry starts only when `NEXT_RUNTIME=nodejs` through [`instrumentation.ts`](v2-nextjs/instrumentation.ts). It uses the OpenTelemetry `NodeSDK` and the standard `OTEL_SERVICE_NAME` and `OTEL_EXPORTER_OTLP_ENDPOINT` variables. Browser setup is isolated in [`browser.ts`](v2-nextjs/src/telemetry/browser.ts).

## Collector: local versus cloud

Both Collector files have the same OTLP receiver and batch processor. The only meaningful change is the exporter:

```bash
diff -u collector.local.yaml collector.cloud.yaml
```

- [`collector.local.yaml`](collector.local.yaml) accepts OTLP/gRPC and OTLP/HTTP, permits the local browser origin, and exports to Jaeger.
- [`collector.cloud.yaml`](collector.cloud.yaml) accepts the same signals and exports to Azure Monitor using `APPLICATIONINSIGHTS_CONNECTION_STRING`.

The application code does not import an Azure SDK and does not change between destinations. In the Azure topology, server spans use the Collector sidecar at `localhost:4318`; set the browser exporter URL at image build time to a publicly reachable OTLP/HTTP endpoint if browser spans are required in the cloud demo.

## Claude Code + local Jaeger

The checked-in [`.mcp.json`](.mcp.json) runs Traceloop’s OpenTelemetry MCP server with `uvx` and reads Jaeger at `http://localhost:16686`.

```bash
claude mcp list
claude
```

Exact demo prompt:

> Users say the events page is slow. Find out why.

A good answer identifies the `getEventsWithSeatsLeft` span, reports about 151 SQLite queries for one page load, recognizes the repeated `SELECT COUNT(*) ... WHERE event_id = ?`, connects the repeated per-query latency to the total duration, and recommends the existing grouped query. It should use trace evidence, not infer the problem only from source code.

## Azure preparation (do not run during local setup)

[`infra/main.bicep`](infra/main.bicep) declares a Log Analytics workspace, workspace-based Application Insights, Container Apps environment, and one Container App with the Next.js container plus an OpenTelemetry Collector sidecar. The Application Insights connection string is passed to the sidecar as a Container Apps secret.

Build and push the two images, update `infra/main.bicepparam`, then deploy manually:

```bash
az login
az group create --name project-x-demo --location canadacentral
az acr build --registry <registry> --image project-x:latest --file Dockerfile .
az acr build --registry <registry> --image project-x-collector:latest --file Dockerfile.collector .
az deployment group what-if --resource-group project-x-demo --template-file infra/main.bicep --parameters infra/main.bicepparam
az deployment group create --resource-group project-x-demo --template-file infra/main.bicep --parameters infra/main.bicepparam
```

SQLite inside the app container is **ephemeral**. The app creates the schema and seeds itself when the database is empty, which is ideal for this demo but not production persistence. The Bicep pins the app to one replica so the demo does not split reservations across independent SQLite files.

# Live demo runbook

## 0. John’s first version (v1-vite)

This is the deliberately plain MVP: one React page, one Express endpoint, the shared N+1 query, and no observability.

Start it from its own directory. One command launches the API on port 3001 and Vite on port 5173:

```bash
cd v1-vite
SIMULATED_DB_LATENCY_MS=13 npm run dev
```

`13` ms × 151 SQLite queries, plus request overhead, produces a request close to two seconds on a typical laptop. The API uses 13 ms by default, but setting it explicitly makes the stage setup unambiguous.

Live demo:

1. Open [http://localhost:5173](http://localhost:5173). The shell appears immediately, then the plain “Loading events…” message sits there long enough to feel wrong.
2. Open browser DevTools, select the **Network** tab, and reload the page.
3. Click the single `/api/events` request and open **Timing**. Point out that nearly the entire page delay is inside this one request.
4. Look through the other browser panels: there are no traces, database spans, query counts, or backend breakdowns. John knows the request is slow, but not why.
5. Close v1 with `Ctrl+C`. It can run beside v2 without conflicts: v1 uses 5173/3001, while v2 uses 3000.

Record a backup clip before the talk:

1. Reset the database, start v1 with the command above, and open DevTools beside the page.
2. On macOS press `Shift+Command+5`, choose **Record Selected Portion**, and frame both the page and DevTools Network panel.
3. Start recording, reload the page, select `/api/events`, and show its **Timing** tab for several seconds.
4. Stop from the menu-bar recording control, save the clip as `project-x-v1-backup.mov`, and play it once with Wi-Fi disabled to confirm it is self-contained.

## 1. Before the talk

From the repository root:

```bash
npm install
cp v2-nextjs/.env.example v2-nextjs/.env.local
npm run db:reset
docker compose up -d
npm run dev
```

In a second terminal, verify the services and warm the API routes:

```bash
curl --silent --output /dev/null --write-out 'Collector HTTP %{http_code}\n' http://localhost:4318/
curl --fail http://localhost:3000/api/events > /dev/null
curl --fail 'http://localhost:3000/api/events?id=1' > /dev/null
open http://localhost:3000
open http://localhost:3000/events/1
open http://localhost:16686
```

The Collector root may return `404`; that still confirms the port is listening. In the browser, load `/` and `/events/1` once. Confirm Jaeger’s service list includes `project-x` and `project-x-browser`, then return to a clean events page.

## 2. John’s first trace

1. Open event 1 and click **Reserve a seat** once.
2. In Jaeger, choose service `project-x-browser` and operation `click: Reserve seat`, then click **Find Traces**.
3. Open the newest trace. Point out the browser parent, the `POST /api/reserve` server work, the capacity query, and the insert span in one trace.

## 3. The bug

1. Open or reload [http://localhost:3000](http://localhost:3000).
2. In Jaeger, search service `project-x-browser` for operation `page: Load events`.
3. Open the newest trace and expand `getEventsWithSeatsLeft`.
4. Show the first event query followed by 150 repeated reservation-count spans. With `SIMULATED_DB_LATENCY_MS=5`, the staircase is intentionally obvious.

## 4. The same trace in the cloud

The application still emits OTLP. Replace the local Collector destination with the cloud configuration (the sidecar image already contains it); no application instrumentation code changes.

In Application Insights, open **Transaction search** to find the request, or **Logs** and run:

```kusto
dependencies
| where timestamp > ago(15m)
| where name startswith "db."
| order by timestamp asc
```

Open an end-to-end transaction and show the same repeated database dependencies. The destination changed; the trace model did not.

## 5. Claude debugs locally

Keep Jaeger running, start Claude Code in the repository, and paste exactly:

> Users say the events page is slow. Find out why.

Ask it to show the trace evidence if it gives only a code-level answer. A strong response calls out the 150 repeated count queries and their cumulative duration.

## 6. The fix

Stop the app, change one variable, and restart:

```bash
EVENTS_QUERY_MODE=optimized npm run dev
```

Reload the events page, open the newest `page: Load events` trace in Jaeger, and expand `getEventsWithSeatsLeft`. The 151-query waterfall is now one grouped query, while the UI and tests remain unchanged.

To restore the opening state:

```bash
npm run db:reset
EVENTS_QUERY_MODE=n_plus_one npm run dev
```
