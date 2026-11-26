import { useEffect, useMemo, useState } from "react";
import type { EventWithSeatsLeft } from "@project-x/shared";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

export default function App() {
  const [events, setEvents] = useState<EventWithSeatsLeft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    fetch("/api/events")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load events");
        return response.json() as Promise<EventWithSeatsLeft[]>;
      })
      .then(setEvents)
      .catch((cause: Error) => setError(cause.message))
      .finally(() => setLoading(false));
  }, []);

  const months = useMemo(
    () => [...new Set(events.map((event) => monthKey(event.date)))].sort(),
    [events],
  );
  const visibleEvents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return [...events]
      .filter((event) => month === "all" || monthKey(event.date) === month)
      .filter((event) =>
        !query || `${event.title} ${event.city}`.toLocaleLowerCase().includes(query),
      )
      .sort((left, right) =>
        sort === "newest"
          ? Date.parse(right.date) - Date.parse(left.date)
          : Date.parse(left.date) - Date.parse(right.date),
      );
  }, [events, month, search, sort]);

  return (
    <>
      <header>
        <div className="header-inner">
          <a className="brand" href="/">Project X</a>
          <span>Tech events</span>
        </div>
      </header>

      <main>
        <div className="intro">
          <p className="label">EVENTS THROUGH JANUARY 2027</p>
          <h1>Find your next tech event</h1>
          <p>Talks, meetups, and workshops for people who build software.</p>
        </div>

        {loading && <p className="status">Loading events…</p>}
        {error && <p className="status error">{error}. Try refreshing the page.</p>}

        {!loading && !error && (
          <section aria-label="Technology events">
            <div className="filters" aria-label="Event filters">
              <label className="search-field">
                <span>Search</span>
                <input
                  type="search"
                  placeholder="Search events"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
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
            <div className="list-heading">
              <h2>All events</h2>
              <span>{visibleEvents.length} of {events.length} events</span>
            </div>
            <div className="events-list">
              {visibleEvents.map((event) => (
                <article className="event" key={event.id}>
                  <div>
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <time dateTime={event.date}>{formatDate(event.date)}</time>
                      <span>{event.city}</span>
                    </div>
                  </div>
                  <p><strong>{event.seatsLeft}</strong> seats left</p>
                </article>
              ))}
              {visibleEvents.length === 0 && (
                <p className="empty-state">No events match those filters.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
