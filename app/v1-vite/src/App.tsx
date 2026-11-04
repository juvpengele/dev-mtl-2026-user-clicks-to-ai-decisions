import { useEffect, useState } from "react";
import type { EventWithSeatsLeft } from "@project-x/shared";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function App() {
  const [events, setEvents] = useState<EventWithSeatsLeft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          <p className="label">UPCOMING EVENTS</p>
          <h1>Find your next tech event</h1>
          <p>Talks, meetups, and workshops for people who build software.</p>
        </div>

        {loading && <p className="status">Loading events…</p>}
        {error && <p className="status error">{error}. Try refreshing the page.</p>}

        {!loading && !error && (
          <section aria-label="Upcoming events">
            <div className="list-heading">
              <h2>All events</h2>
              <span>{events.length} events</span>
            </div>
            <div className="events-list">
              {events.map((event) => (
                <article className="event" key={event.id}>
                  <div>
                    <h3>{event.title}</h3>
                    <time dateTime={event.date}>{formatDate(event.date)}</time>
                  </div>
                  <p><strong>{event.seatsLeft}</strong> seats left</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
