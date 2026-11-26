## Opening

**Who made the decision?**

Why ask that?

Because every single line of code is a decision.

What to query.

When to loop.

What to do when a call fails.

Hundreds of small decisions in a single feature.

So, **who made those decisions?**

*[Pause]*

Keep that question in mind.

We’ll come back to it before the end of the talk.

Hello everyone, and welcome to **From User Clicks to AI Decisions**.

In this talk, I’m going to show you how OpenTelemetry can connect full-stack observability with AI-assisted development.

But before we dive into the topic, let me quickly introduce myself.

My name is **Claudy Juvenal Pengele**.

I’m a software engineer based in Montreal, and I have around ten years of experience building software.

I’m also Azure Solutions Architect and Azure Developer certified.

And, like many of us, I use AI agents as part of my daily development workflow.

So what I’m going to show you today is not just theoretical.

It is very close to the way we build, ship, and debug software today.

If you remember only three things from this talk, I want them to be these.

First:

**How to follow a single user action from the browser all the way to the database.**

Second:

**How to move your observability setup from local development to the cloud without rewriting your instrumentation.**

And third:

**How to give AI agents enough runtime context to help us debug, not only locally, but also in production.**

To explore those ideas, I’d like to introduce you to someone.

His name is **John Doe**.

---

# Chapter 1 — Meet John

So, who is John?

John is a very skilled React developer.

He ships fast.

He uses AI agents as part of his daily workflow.

And right now, he’s working on an exciting project called **Project X**.

But how did Project X start?

Earlier this year, John received a message from his boss.

His boss had what he believed was a brilliant idea.

He wanted to build a booking application dedicated to tech events.

And, of course, he wanted it quickly.

Very quickly.

He wanted the first version ready by Friday.

*[Pause]*

So John started thinking about the stack.

For the frontend, the choice was obvious.

John knew React very well, so he chose React.

For the backend, he only needed a thin API layer, so he chose Express.js.

But there was still one major constraint.

**Time.**

John wanted to ship fast.

So he brought AI agents into his workflow.

He gave the specifications and requirements to one AI agent.

That agent helped generate the code.

Then John used another AI agent to review that code.

A few days later, everything looked good.

The review passed.

The **CI/CD pipeline was green**.

And before Friday, Project X Version 1 was already in production.

John was happy.

His boss was happy.

Everyone was congratulating John on a job well done.

So let me show you what **Project X Version 1** looked like.

*[Demo / show application]*

Project X is a platform where users can discover upcoming tech events.

You can find events in cities such as Montreal, Toronto, Ottawa, and Quebec City.

For each event, you can see the date, the location, the event details, and how many seats are still available.

Everything looks good.

Project X is live.

John delivered on time.

Everyone is happy.

*[Pause]*

Until they aren’t.

---

# Chapter 2 — The Bug

A few days later, John’s boss contacts him again.

But this time, the message is very different.

Users are reporting **slow load times**.

The problem seems especially noticeable on the main page.

When users try to load the list of events, it takes around two seconds before the data appears.

So John starts investigating.

But he has a problem.

He has no idea where the slowdown is coming from.

Is it the browser?

Is it the API?

Is it the database?

Is it the network?

He doesn’t know.

And the worst part is this:

**No error.**

*[Pause]*

**No crash.**

*[Pause]*

**No clue.**

The application works.

It’s just slow.

So John does what many developers do when they don’t know what’s happening.

He starts adding console logs.

Everywhere .

One before the API call.

One after the API call.

One inside the backend.

Another one around the database query.

He is trying to answer one simple question:

**Where is the time going?**

But at this point, John is still guessing.

And this is exactly where observability enters the story.

---

# Chapter 3 — John Discovers Observability

One day, while scrolling through LinkedIn, John comes across an event about **observability and OpenTelemetry in frontend applications**.

Since John works with React, he thinks:

“This might actually help me.”

So he decides to attend.

And guess who the speaker is?

*[Pause]*

Obviously...

**me.**

*[Pause for reaction]*

I’m going to give you the very short version of that talk now.

And if you want the full version later, it’s available on YouTube.

So let’s start with one question.

**What is observability?**

Observability is the ability to understand what is happening inside a system by looking at the data the system emits.

That means:

**No more random console logs.**

**No more guessing.**

Instead, we collect telemetry and let the telemetry tell us what happened.

Traditionally, we talk about three main types of telemetry:

**logs, metrics, and traces.**

---

# Logs

Logs record discrete events that happen inside an application.

For example:

A user logged in.

An error occurred.

A payment was rejected.

A background job completed.

Logs tell us that **something happened**.

---

# Metrics

The second type is metrics.

Metrics are numerical measurements collected over time.

They help us answer questions such as:

**How much?**

**How often?**

For example:

How many users logged in today?

How many API requests did we receive during the last hour?

What is the average response time?

How much CPU are we using?

Those are metrics.

---

# Traces

And the third type is traces.

A trace represents the journey of a single request through the system from start to finish.

Imagine a user clicks **Load Events**.

That action triggers a request.

The request reaches the backend.

The backend queries the database.

The database returns the result.

The backend sends the response.

And eventually, the browser displays the events.

A trace allows us to follow that journey.

And that is exactly what John needs.

John doesn’t just want to know that the page is slow.

He wants to know:

**Where is the time being spent?**

For John’s problem, traces are especially interesting.

---

# Spans

A trace is made up of smaller units called **spans**.

A span represents one operation within a trace.

For example:

The incoming HTTP request can be one span.

The database query triggered by that request can be another span.

And spans can have parent-child relationships.

For example, the incoming API request can be the parent span.

The database query triggered by that request can be a child span.

Together, those spans form the trace.

And each span can carry attributes that give us more context.

For an HTTP request, we might capture things such as:

the route,

the method,

the status code,

and the duration.

For a database operation, we might capture:

the database system,

the operation being performed,

and how long it took.

And this is where traces become very powerful.

Because now, instead of saying:

“The application feels slow,”

we can say:

“This request took two seconds.”

“And 1.7 seconds were spent here.”

That is a completely different level of understanding.

Instead of guessing,

**we let the telemetry tell us what happened.**

---

# Chapter 4 — Why OpenTelemetry?

During the talk, I introduce John to **OpenTelemetry**.

So why OpenTelemetry?

OpenTelemetry is an open standard and a set of tools for generating, collecting, and exporting telemetry data.

And one of its biggest advantages is that it is **vendor-neutral**.

That means your application is not locked into one specific observability backend.

You instrument your application using OpenTelemetry APIs and SDKs.

Then the telemetry can be exported, commonly using **OTLP**, the OpenTelemetry Protocol.

And from there, you can send that telemetry to different backends.

For example:

Jaeger.

Grafana.

Azure Monitor.

Other cloud observability platforms.

Or SaaS platforms such as Sentry.

The important idea is this:

**Your instrumentation does not have to depend on the backend you choose.**

You can change the destination without rewriting your entire application.

And that is going to become very important later in this talk.

---

# Chapter 5 — John Feels Stuck

John leaves the meetup excited.

Finally, something better than adding `console.log` everywhere.

That night, he opens the OpenTelemetry documentation and starts thinking about how to use it in Project X.

And then he notices something.

On the server side, OpenTelemetry tracing is mature and widely supported.

In the browser, it is still much more limited.

*[Pause]*

And that matters because Project X Version 1 is mostly frontend.

React and Vite do most of the work, with only a very thin Express API in the middle.

So John has discovered a powerful tool...

but he does not yet have much server-side behavior to observe.

He can start a trace when the user clicks and propagate that context to the backend.

But the backend does very little.

So for now, John feels a little stuck.

And then Project X changes.

---

# Chapter 6 — Project X Version 2

A few days later, John’s boss comes back.

“Users love Project X. Now we need Version 2.”

This time, they want more.

Event details.

Speakers.

Capacity rules.

Reservations.

And they need to make sure two users cannot reserve the same last seat.

*[Pause]*

Now we are talking about real business logic.

That cannot all live in the browser anymore.

And a thin Express API is no longer enough.

So John needs a real server-side application.

But he wants to keep React and avoid throwing away what already works.

So he chooses Next.js.

*[Show: React + Vite + Express → Next.js]*

And this is important:

**John does not choose Next.js because of OpenTelemetry.**

**He chooses it because the product has changed.**

But that decision gives him something interesting.

He now has a real server.

And the server is exactly where OpenTelemetry is mature.

Now a user action can start in the browser, continue through the server, execute business logic, query the database, and all of that can be connected inside the same trace.

So now John can finally ask:

**Can we follow one user action all the way from the browser to the database?**

Let’s try.

---

# Chapter 8 — OpenTelemetry

Picks up from slide 26: **"the server is exactly where OpenTelemetry is mature."**

> Yes. One request goes through all three. That amber line is one trace. Keep an eye on amber: in this talk, amber always means "the trace."

> Wait. The browser and the server are two different programs. How does the server know this request comes from the same click? **[Pause]** A header. This is the request the browser sends when you click "Reserve a seat."

> This line: traceparent. It's a W3C standard: a version, a trace ID, a parent span ID, and flags. John doesn't write it by hand. The browser instrumentation adds it.

> Think of the trace ID as a ticket. The browser hands it over, and the server continues the same trace instead of starting a new one. Same ID on both sides: one trace.

- --

**## #30 · instrumentation.ts**

> So what does John add on the server? This one file. That's the whole setup.

> Next.js calls register once, when the server starts.

> Only in the Node runtime. The edge runtime can't run the Node SDK, so we skip it there.

> A name. This is what you'll search for later, so pick a good one.

> OTLP is OpenTelemetry's own format, and it's vendor-neutral.

> And this is the line that does the work. HTTP, fetch, Postgres: you get spans for free. John doesn't touch his business logic.

> Start. That's it: about fifteen line

---

---

# Chapter 9 — From Guessing to Observing

Back on the slides, let’s look at what John just saw.

Time goes from left to right, and each bar represents a span.

At the top, we have the user action in the browser.

Then the server handles the request.

And under the server, we can see the database operations.

Because spans have parent-child relationships, John can now see how one operation led to another and how long each one took.

For the first time, John can follow the entire journey of one user action.

Now remember the problem from the beginning.

Users said the application was slow.

One query to get the events, and then one additional query for every event.

This pattern has a name.

**N+1.**

One query gets the list.

Then one additional query is executed for every item in that list.

And when John looks at the code, he can see exactly where those repeated database operations originate.

The code was valid.

The tests were green.

The pipeline was green.

It just didn’t scale.

Before OpenTelemetry, John was asking:

**Is it React?Is it the API?Is it the network?Is it the database?**

Now he doesn’t have to guess.

The trace gives him evidence.

**We went from guessing to observing.**

---

# Chapter 10 — The Cloud Agent

Now Project X continues to grow.

And John’s boss wants to move it to the cloud.

That creates a new question.

What happens to our observability setup?

Do we need to rewrite everything?

Do we need one implementation for Jaeger locally and another one in production?

This is where one of the major advantages of OpenTelemetry becomes important.

The instrumentation is vendor-neutral.

Locally, John can have:

**Application → OpenTelemetry → Jaeger**

And in the cloud:

**Application → OpenTelemetry → Cloud observability backend**

The instrumentation model stays largely the same.

What changes is mainly the destination and the configuration.

That gives us our second takeaway:

**We can move from local observability to cloud observability without rebuilding the instrumentation model**

John’s boss asks him a new question:

**“We already use AI to write code. But how can AI help us in production?”**

John realizes that Project X is already running in the cloud, and the telemetry is already available.

So he decides to use an observability agent.

Unlike a traditional coding agent, this agent has access to production telemetry: traces, logs, and metrics.

Imagine some booking requests start failing in production.

The agent can inspect the failed traces, identify the failing span, and connect the runtime behavior back to the source code, if it has access.

But is the AI more intelligent?

No. **We simply gave it better context.**

Production context. Runtime context.

And that changes the debugging workflow.

**Code tells the agent what the system can do.**

**Telemetry tells the agent what the system actually did.**

---

# Chapter 11 — The Local Agent

But this idea is not limited to production.

We can bring the same workflow back to John's machine.

John already has the source code, OpenTelemetry, Jaeger, and his AI coding agent.

What if we also gave his coding agent access to the local telemetry?

Instead of simply asking:

**“Why is my application slow?”**

John can now ask:

**“Look at this trace and tell me where the latency is coming from.”**

The agent can identify slow spans, repeated database queries, and errors, and connect them back to the source code.

Before, we had:

**Code → AI → Hypothesis**

Now, we have:

**Code + Telemetry → AI → Evidence-based hypothesis**

And that brings us to our third takeaway:

**To help AI agents debug real systems, source code alone is not enough.**

We also need runtime context.

---

# Chapter 12 — The Decision

Now, let's come back to the question I asked at the beginning.

**Who made the decision?**

One AI agent wrote the code.

Another agent reviewed it.

John approved it.

The tests passed, the pipeline was green, and the application went to production.

But those decisions had consequences that only became visible at runtime.

And that's what observability gives us: **evidence.**

So maybe the question is not just:

**“Who made the decision?”**

But also:

**“What happened because of that decision?”**

As AI helps us generate code faster, our development loop changes.

- The human defines the goal.
- AI helps generate the code.
- The system runs.
- OpenTelemetry captures its behavior.
- Humans and AI agents analyze the evidence.
- The human decides what to do next.

And that last part matters.

AI can investigate, analyze, and suggest solutions.

But we still need engineering judgment, access control, data governance, and human responsibility.

**The human still makes the decision.**

---

# Final Conclusion

Let's go back to the three things I promised you at the beginning.

**First, following one user action from the browser to the database.**

We did that using traces and spans.

**Second, moving observability from local development to the cloud.**

Same instrumentation model. Different destination.

**Third, giving AI agents enough context to help us debug.**

Not just source code, but runtime evidence.

*[Pause]*

AI can help us write software faster.

But writing software faster doesn't automatically mean building better systems.

We still need to understand what happens when that software runs.

**AI gives us acceleration.**

**Observability gives us visibility.**

*[Pause]*

So, who made the decision?

Maybe the developer.

Maybe the AI agent.

Maybe both.

But whoever made it...

**We should be able to observe what that decision caused.**

Thank you.

---