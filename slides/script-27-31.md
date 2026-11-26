# Script · Slides 27–31 (Chapter 5 · Telemetry)

Picks up from slide 26: *"the server is exactly where OpenTelemetry is mature."*

---

## #27 · Chapter 5 · Telemetry
⏱ 0:05

> Chapter five. Telemetry. Time for John to try what he heard at the meetup.

---

## #28 · Architecture v2: one trace
⏱ 0:50

> Here's Project X, version two. Three pieces: the browser with React, the Next.js server with the API route, and Postgres.
>
> For the user, nothing changes. Same app, same pages. What changed is behind the scenes: the business logic now runs on a server, and John can actually watch a server.
>
> The browser's job gets small: start the trace when the user clicks, and pass it along.
>
> So the question is simple: can John follow one click all the way to the database?

**Click**

> Yes. One request goes through all three. That amber line is one trace. Keep an eye on amber: in this talk, amber always means "the trace."

---

## #29 · The traceparent ticket
⏱ 0:50

> Wait. The browser and the server are two different programs. How does the server know this request comes from the same click? *[Pause]* A header. This is the request the browser sends when you click "Reserve a seat."

**Click** · the traceparent line lights up

> This line: traceparent. It's a W3C standard: a version, a trace ID, a parent span ID, and flags. John doesn't write it by hand. The browser instrumentation adds it.

**Click** · the ticket moves across

> Think of the trace ID as a ticket. The browser hands it over, and the server continues the same trace instead of starting a new one. Same ID on both sides: one trace.

---

## #30 · instrumentation.ts
⏱ 1:20

> So what does John add on the server? This one file. That's the whole setup.

**Click** · `register()`

> Next.js calls register once, when the server starts.

**Click** · Node runtime

> Only in the Node runtime. The edge runtime can't run the Node SDK, so we skip it there.

**Click** · `serviceName`

> A name. This is what you'll search for later, so pick a good one.

**Click** · OTLP exporter

> OTLP is OpenTelemetry's own format, and it's vendor-neutral. Remember that word. It comes back in chapter six.

**Click** · auto-instrumentations

> And this is the line that does the work. HTTP, fetch, Postgres: you get spans for free. John doesn't touch his business logic.

**Click** · `sdk.start()`

> Start. That's it: about fifteen lines.

*If someone asks:* in a real project, put the Node-only imports in a separate file and import it dynamically inside `register()`.

---

## #31 · Demo: John's first trace
⏱ 2:00

> Enough slides. Let's see if it works.

*Switch to the app.*

1. > Here's Project X. I'll reserve a seat, like any user.

   Click **Reserve a seat**.

2. > Now Jaeger, an open-source trace viewer running on my laptop.

   Pick the service **`project-x-browser`** (the trace starts in the browser) and open the latest trace.

3. > At the top: the click in the browser. Under it, the POST to /api/reserve on the server. And under that, the database queries.

4. > One click. Browser, server, database. One trace. *[Pause]* Remember John at the meetup, stuck because his trace ended in the browser? Now it ends in the database.

*If the demo fails:* skip to the next slide. The waterfall on slide 32 shows the same trace.

---

### Notes

- **Service names:** the browser reports as `project-x-browser` and the server as `project-x`. Searching either one in Jaeger finds the trace.
- **The OTLP line on #30:** "It comes back in chapter six" sets up the Collector slide, where Azure is added without changing app code. Drop that sentence if you're short on time.
