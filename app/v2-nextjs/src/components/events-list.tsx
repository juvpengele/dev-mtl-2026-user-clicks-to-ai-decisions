"use client";

import type { EventWithSeatsLeft } from "@project-x/shared";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { withBrowserSpan } from "@/telemetry/browser";

function monthKey(value: string) {
  return value.slice(0, 7);
}

function monthLabel(value: string) {
  return new Date(`${value}-01T12:00:00Z`).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function EventCard({ event, index }: { event: EventWithSeatsLeft; index: number }) {
  const date = new Date(event.date);
  const isPast = date.getTime() < Date.now();
  return (
    <Link className="event-card" href={`/events/${event.id}`}>
      <span className="event-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="event-date">
        <strong>{date.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</strong>
        <span>{date.toLocaleDateString("en-CA", { year: "numeric" })}</span>
      </div>
      <div className="event-copy">
        <h2>{event.title}</h2>
        <div className="event-tags">
          <span>{event.city}</span>
          {event.format === "online" && <span className="format-tag">Online</span>}
          {isPast && <span className="past-tag">Past event</span>}
        </div>
      </div>
      <div className="seat-count">
        <strong>{isPast ? "—" : event.seatsLeft}</strong>
        <span>{isPast ? "ended" : "seats left"}</span>
      </div>
      <span className="arrow" aria-hidden="true">↗</span>
    </Link>
  );
}

export function EventsList() {
  const [events, setEvents] = useState<EventWithSeatsLeft[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [month, setMonth] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

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

  const months = useMemo(
    () => [...new Set(events.map((event) => monthKey(event.date)))].sort(),
    [events],
  );
  const cities = useMemo(
    () => [...new Set(events.map((event) => event.city))].sort(),
    [events],
  );
  const visibleEvents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return [...events]
      .filter((event) => city === "all" || event.city === city)
      .filter((event) => month === "all" || monthKey(event.date) === month)
      .filter((event) =>
        !query ||
        `${event.title} ${event.city} ${event.speaker}`.toLocaleLowerCase().includes(query),
      )
      .sort((left, right) =>
        sort === "newest"
          ? Date.parse(right.date) - Date.parse(left.date)
          : Date.parse(left.date) - Date.parse(right.date),
      );
  }, [city, events, month, search, sort]);

  if (loading) {
    return <section className="events-state" aria-live="polite"><span className="pulse" />Loading events…</section>;
  }
  if (error) {
    return <section className="events-state error">{error}. Please refresh the page.</section>;
  }

  return (
    <section className="events-section" aria-label="Technology events">
      <div className="event-filters" aria-label="Event filters">
        <label className="filter-search">
          <span>Search</span>
          <input
            type="search"
            placeholder="Title, city, or speaker"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label>
          <span>City</span>
          <select value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="all">All cities</option>
            {cities.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label>
          <span>Month</span>
          <select value={month} onChange={(event) => setMonth(event.target.value)}>
            <option value="all">All months</option>
            {months.map((value) => <option key={value} value={value}>{monthLabel(value)}</option>)}
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as "newest" | "oldest")}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      <div className="section-heading">
        <h2>All events</h2>
        <span>{visibleEvents.length} of {events.length} dates</span>
      </div>
      <div className="event-list">
        {visibleEvents.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
        {visibleEvents.length === 0 && <p className="no-events">No events match those filters.</p>}
      </div>
    </section>
  );
}
