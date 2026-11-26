Speaker notes. Each "## <slide-id>" heading holds the notes for that slide (see src/slides/ch*.tsx).
"Click" = one step on that slide. ⏱ = time budget for the slide. Target: ~35 min total, slot is 45 incl. Q&A.
Chapter budgets: 1 Project X 5:05 · 2 The bug 2:20 · 3 The talk 8:00 · 4 Next.js 2:35 · 5 Telemetry 7:45 · 6 Cloud 4:45 · 7 Cloud agent 3:05 · 8 Local agent 2:45 · 9 The decision 2:00

## cold-open
⏱ 0:20
Walk on with the screen black. Pause. Click: the question types in, word by word.
Open with the question. Don't answer it yet.

## title
⏱ 1:20
Introduce yourself in one sentence. "This is the story of one developer, and one click."
Click: about me. "A few words about me. I'm a software engineer here in Montréal, with about ten years of experience. I'm a certified Azure Solutions Architect and Azure Developer, and like most of you, I work every day with AI agents that write code with me. So the question I just asked you isn't theoretical for me. I live it every week."
Click: what you'll leave with. "In the next minutes, you'll learn three things. How to follow a single user click from the browser all the way to your database. How to take that to the cloud without changing your code. And how to give AI agents the data they need to debug with you."

## card-project-x
⏱ 0:05
Just click through. The bar at the bottom is John's journey: nine chapters.

## meet-john
⏱ 0:35
"Meet John." He's a developer like us: ships fast and uses AI every day.
Click: Project X. That's his company's big bet.

## boss-best
⏱ 0:30
The boss walks in with an idea: a booking app, "the next best application". And it has to be ready by Friday.
Read it in the boss's voice. Light laugh. Everyone has heard this.

## john-plans
⏱ 0:45
John thinks it through, one idea per click.
React, obviously: he's a big React fan. Click: a small API with Express, just enough backend. Click: and ship it fast: his AI agent can write most of it.

## ai-builds
⏱ 1:00
The agent writes the code (it types itself). Click: another agent reviews it. LGTM. Click: CI is green.
John didn't read every line. Neither do we. (Remember this code: we'll see it again.)

## shipped
⏱ 0:30
Project X goes to production. The deploy bar fills: it's live.
Click: the boss is thrilled. "Live before Friday? Amazing. Great job, John!"
Enjoy the moment. It doesn't last.

## card-the-bug
⏱ 0:05

## boss-slow
⏱ 0:30
The bug comes first. No details, no error message. Just: "the app is slow."

## where-is-it
⏱ 1:45
John's first question: where is it happening? Here's v1, exactly his plan.
Click: React? Click: the API? Click: the database? Each one goes dark: he can't see inside any of them.
Click: "No error." Pause. Click: "No crash." Pause. Click: "No idea." Let it sit. That's debugging blind.

## console-logs
⏱ 0:45
The application works. It's just slow. So John does what many developers do when they don't know what's happening: he starts adding console logs. Everywhere.
Click: one before the API call. Click: one after the API call. Click: one inside the backend. Click: another one around the database query. Click: they all light up: "Everywhere."

## where-is-the-time
⏱ 0:20
He's trying to answer one simple question: where is the time going?
Click: "Still guessing." But at this point, John is still guessing. And this is exactly where observability enters the story.

## card-the-talk
⏱ 0:05

## meetup-post
⏱ 0:35
"That evening, John is scrolling LinkedIn." The feed scrolls; a post lands: the React Montréal meetup, and the next one is about observability. A talk called 'OpenTelemetry in Frontend Applications'.
Click: John hits Attend. "Exactly what he needs."

## conference
⏱ 0:50
"So John goes to the React Montréal meetup. He's in the audience, watching 'OpenTelemetry in Frontend Applications'."
Click: the speaker's name. It's me. Pause and let them get it: you're watching that talk right now.

## observability
⏱ 0:50
The definition. Read it slowly. Key words: from the outside, the data it emits.
Click: "Not by guessing. Not by adding console.logs and redeploying." That's exactly what John was doing.

## three-signals
⏱ 1:00
Logs, metrics, traces. One click per signal, one sentence each.
Click: Logs. "What your code said happened, one line at a time."
Click: Metrics. "Numbers over time: how many, how often, how slow."
Click: Traces. "What happened to this one request, everywhere it went." Today we focus on traces.

## trace-anatomy
⏱ 1:00
"A trace is made of spans." The waterfall replays one request: browser → Next.js → two queries.
Click: "Each span is one step: an HTTP call, a database query."
Click: "Spans are nested." The brackets show the browser span is the parent of the server span, and the server span is the parent of the two queries.
Click: "And each one has a duration and attributes that describe it." Point at the card: 60 ms, sqlite, seats, and its parent. That's what you, and later an AI agent, will search on.

## opentelemetry
⏱ 2:00
OpenTelemetry: an open standard to create, collect, and export telemetry. Vendor-neutral.
Click: the SDK in your app creates spans. Click: OTLP, one wire format. Click: any backend: open source, cloud, SaaS.
This is the part that makes the rest of the story possible.

## otel-hope
⏱ 1:00
John leaves the conference excited. "Finally, something better than console logs."
Click: that night, he opens the OpenTelemetry docs. And he finds this. On the server, tracing is stable. Mature. Widely used.
Click: in the browser? Still experimental. [Pause]

## john-stuck
⏱ 1:20
Now think about John's app. Version one is almost all frontend: React, Vite, and a thin Express API in the middle that barely does anything.
Click: so John has the right tool… and almost nowhere to use it. [Pause]
Click: he can still instrument the browser a little. Enough to start a trace when the user clicks. But that's where his trace starts… and almost immediately, where it ends.
Click: the browser is where a trace starts. It's not where it lives.

## card-nextjs
⏱ 0:05

## boss-v2
⏱ 0:25
John is already using React. So instead of rebuilding from scratch, he starts looking at Next.js. Why?
A few days later, his boss comes back: "Users love Project X. Now we need version two."

## version-two
⏱ 0:50
Event details. Speakers. Capacity rules. Waitlists. And reservations that never double-book a seat. [Pause]
Click: that's real business logic. It can't live in the browser, and a thin Express API isn't enough anymore. John needs a real server.

## next-move
⏱ 1:10
But he doesn't want to throw away what he built. His team knows React. The pages work.
Click: so he picks Next.js, for two reasons. He gets a real server for the business logic, and he keeps React.
Click: that decision was about the product, not about telemetry.
Click: and then John notices something. [Pause] He now has a server. And that's exactly where OpenTelemetry is mature.

## card-telemetry
⏱ 0:05

## arch-v2
⏱ 0:50
So he keeps the browser part small: start the trace when the user clicks, and pass it along. Everything after that, the business logic, the queries, the database, now runs somewhere he can actually watch.
For the user, nothing changes. Same React app, same pages. But behind the scenes, John finally has a place to see what's happening.
So the question becomes: can we follow one click all the way to the database? Let's try.
Click: one request travels through all three. That amber path is one trace. Amber always means "the trace" in this talk.

## traceparent
⏱ 0:50
How does the server know it's the same request? A header.
Click: traceparent (W3C Trace Context: version, trace id, parent span id, flags).
Click: the trace id is the ticket. The browser hands it to the server; the server continues the same trace.

## instrumentation
⏱ 1:20
This is the whole server setup.
Clicks: register() (Next.js calls it once at startup) → Node runtime only (edge has no Node SDK) → serviceName (what you'll search for) → OTLP exporter (vendor-neutral) → auto-instrumentations (http, fetch, pg spans for free) → start.
If asked: in a real project, put the Node-only imports in a separate file and import it dynamically inside register().

## demo-first-trace
⏱ 2:00
SWITCH TO THE LIVE APP.
Click "Reserve seat", open Jaeger, find the trace. Show the browser span with the server and database spans under it.

## waterfall
⏱ 0:40
Back on the slides: read the waterfall. Time goes left to right, children nest under parents.
The top span is what the user actually felt.

## n-plus-one
⏱ 1:15
"Remember the bug?" Pause.
Click: locally, 10 events: 11 queries. Looks fine.
Click: production, 100 events. Let the cascade run. Don't talk over it. 101 queries, almost 2 seconds.
Click: name it. N+1: one query for the list, then one per event.

## n-plus-one-code
⏱ 0:35
This is the code from the start of the talk. Click: the loop. Click: one database round trip per event.
"Written by the agent. Approved by the agent. Approved by John."

## before-after
⏱ 0:20
Before: no idea. Click: after: the exact line.

## card-cloud
⏱ 0:05

## boss-cloud
⏱ 0:20
The boss again.

## john-worry
⏱ 0:20
John's real question. He finally has a workflow that works.

## collector
⏱ 1:20
The app only speaks OTLP to a Collector. The Collector fans out to Jaeger locally.
Click: add Azure Application Insights. It's Collector config, not app code.
Click: app code changes: zero.

## demo-cloud
⏱ 2:40
SWITCH TO THE LIVE APP.
Show the same trace id in Application Insights (transaction search / end-to-end view).

## card-cloud-agent
⏱ 0:05

## boss-ai
⏱ 0:20
The boss loves AI. John is smiling this time: he's ready.

## sre-agent
⏱ 2:00
In the cloud, Azure SRE Agent reads the traces, logs and metrics.
Click: the finding. It points at the slow query: 101 queries per request, N+1 in getEvents().
It found it because John set up proper telemetry.

## only-as-good
⏱ 0:40
Say it once. Without traces there is nothing for the agent to read.

## card-local-agent
⏱ 0:05

## agent-mcp
⏱ 0:40
John goes further, on his own laptop. Claude talks to an MCP server.
Click: the MCP server exposes tools over the traces: search_traces, find_errors.

## demo-agent
⏱ 1:40
SWITCH TO CLAUDE.
Paste the prompt. Let it call search_traces, find the N+1 in the trace, propose the fix.
Read its reasoning out loud; point at the spans it cites.

## fixed
⏱ 0:20
Same request, same scale. Click: 101 query spans collapse into one (LEFT JOIN + GROUP BY). ~1.9 s → ~50 ms.

## card-decision
⏱ 0:05

## who-decided-again
⏱ 0:15
Same question as the opening. Now we can answer it.

## loop
⏱ 0:40
One click at a time: AI wrote the code → observability recorded what it did → agents read the traces.
Last click: John decided. The agents found it and proposed it. John decided to ship it.

## takeaways
⏱ 0:45
One per click.
1. Start the trace where the user is: that's where their time starts.
2. OpenTelemetry: one Collector config change moved John to a different vendor.
3. Good span names and attributes are for your future self, and for the agent reading them.

## closing
⏱ 0:10
Slow. Say it once. Stop.

## thanks
⏱ 0:05
Point to the QR codes: demo repo and the organizers' feedback form. Take questions.
