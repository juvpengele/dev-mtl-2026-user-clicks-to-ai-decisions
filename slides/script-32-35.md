# Script · Slides 32–35 (Chapter 5 · Telemetry)

## #32 · Trace waterfall

Back on the slides, let's read what John just saw.

This is called a waterfall. Time goes from left to right, and each bar is a span.

The top bar is the page loading the events in the browser. That's what the user actually felt: about one second.

Under it, the browser calls the API. Then the Next.js server takes over, runs the route, and calls getEventsWithSeatsLeft.

And under that, the database queries. Small ones, a few milliseconds each. But look at the count: 151 of them.

Children nest under their parents, so you can see exactly who called what, and how long each step took.

For the first time, John can see the whole journey of one click.

## #33 · Remember the bug? N+1

Now, remember the bug? Users said the app was slow.

John opens the events page on his laptop. Ten events, eleven queries, about 230 milliseconds. It looks fine.

Now the same page in production, with a hundred events.

Let it run.

One hundred and one queries, one after the other. Almost two seconds for a single page.

This pattern has a name: N+1. One query to get the list, and then one more query for every event in that list.

On his laptop, John could never have seen it. In production, the trace shows it immediately.

## #34 · The loop (AI-written)

So where does it come from? This is the code from the very beginning of the talk.

Here is the loop. For every event, it goes back to the database to count the seats.

That's one round trip per event. A hundred events, a hundred extra queries.

The code is correct. The tests were green. It just doesn't scale.

Written by the agent. Approved by the agent. Approved by John.

## #35 · Before / after

Before, with React and Vite, John had no idea where the time was going. Was it React, the API, or the database?

After, with Next.js and OpenTelemetry, he doesn't just know it's the database. He knows the exact line.

That's the difference between guessing and observing.
