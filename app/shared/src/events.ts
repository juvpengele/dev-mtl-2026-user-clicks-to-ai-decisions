import type {
  DatabaseClient,
  EventRecord,
  EventsQueryMode,
  EventWithSeatsLeft,
} from "./types";

type ReservationCount = { reservationCount: number };
type EventWithCount = EventRecord & { reservationCount: number };

export async function getEventsWithSeatsLeft(
  db: DatabaseClient,
): Promise<EventWithSeatsLeft[]> {
  const events = await db.all<EventRecord>(
    "SELECT id, title, date, capacity FROM events ORDER BY date ASC",
  );

  const eventsWithSeats: EventWithSeatsLeft[] = [];
  for (const event of events) {
    const result = await db.get<ReservationCount>(
      "SELECT COUNT(*) AS reservationCount FROM reservations WHERE event_id = ?",
      [event.id],
    );

    eventsWithSeats.push({
      ...event,
      seatsLeft: Math.max(0, event.capacity - (result?.reservationCount ?? 0)),
    });
  }

  return eventsWithSeats;
}

export async function getEventsWithSeatsLeftOptimized(
  db: DatabaseClient,
): Promise<EventWithSeatsLeft[]> {
  const events = await db.all<EventWithCount>(`
    SELECT
      e.id,
      e.title,
      e.date,
      e.capacity,
      COUNT(r.id) AS reservationCount
    FROM events e
    LEFT JOIN reservations r ON r.event_id = e.id
    GROUP BY e.id, e.title, e.date, e.capacity
    ORDER BY e.date ASC
  `);

  return events.map(({ reservationCount, ...event }) => ({
    ...event,
    seatsLeft: Math.max(0, event.capacity - reservationCount),
  }));
}

export function parseEventsQueryMode(value?: string): EventsQueryMode {
  return value === "optimized" ? "optimized" : "n_plus_one";
}

export async function loadEvents(
  db: DatabaseClient,
  mode: EventsQueryMode = "n_plus_one",
): Promise<EventWithSeatsLeft[]> {
  return mode === "optimized"
    ? getEventsWithSeatsLeftOptimized(db)
    : getEventsWithSeatsLeft(db);
}
