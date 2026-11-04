"use client";

import type { EventWithSeatsLeft } from "@project-x/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withBrowserSpan } from "@/telemetry/browser";

function EventCard({ event, index }: { event: EventWithSeatsLeft; index: number }) {
  const date = new Date(event.date);
  return (
    <Link className="event-card" href={`/events/${event.id}`}>
      <span className="event-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="event-date">
        <strong>{date.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</strong>
        <span>{date.toLocaleDateString("en-CA", { year: "numeric" })}</span>
      </div>
      <h2>{event.title}</h2>
      <div className="seat-count">
        <strong>{event.seatsLeft}</strong>
        <span>seats left</span>
      </div>
      <span className="arrow" aria-hidden="true">↗</span>
    </Link>
  );
}

export function EventsList() {
  const [events, setEvents] = useState<EventWithSeatsLeft[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    withBrowserSpan(
      "page: Load events",
      { "ui.route": "/", "code.function.name": "loadEventsPage" },
      async () => {
        const response = await fetch("/api/events", { cache: "no-store" });
        if (!response.ok) throw new Error("Could not load events");
        const result = (await response.json()) as EventWithSeatsLeft[];
        if (!cancelled) setEvents(result);
      },
    )
      .catch((cause: Error) => !cancelled && setError(cause.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <section className="events-state" aria-live="polite"><span className="pulse" />Loading events…</section>;
  }
  if (error) {
    return <section className="events-state error">{error}. Please refresh the page.</section>;
  }

  return (
    <section className="events-section" aria-label="Upcoming events">
      <div className="section-heading">
        <h2>All events</h2>
        <span>{events.length} dates</span>
      </div>
      <div className="event-list">
        {events.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
      </div>
    </section>
  );
}
