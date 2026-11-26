import { trace } from "@opentelemetry/api";
import { NextRequest, NextResponse } from "next/server";
import { run, tracedDb } from "@/server/database";

export const runtime = "nodejs";

type EventCapacity = { capacity: number; reserved: number; date: string };

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { eventId?: number };
  const eventId = Number(body.eventId);
  const activeSpan = trace.getActiveSpan();
  activeSpan?.setAttributes({
    "http.route": "/api/reserve",
    "code.function.name": "reserveSeat",
    "project_x.event_id": eventId,
  });

  if (!Number.isInteger(eventId)) {
    return NextResponse.json({ error: "A valid eventId is required" }, { status: 400 });
  }

  const event = await tracedDb.get<EventCapacity>(
    `SELECT e.capacity, e.date, COUNT(r.id) AS reserved
     FROM events e
     LEFT JOIN reservations r ON r.event_id = e.id
     WHERE e.id = ?
     GROUP BY e.id, e.capacity, e.date`,
    [eventId],
  );

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  if (Date.parse(event.date) < Date.now()) {
    return NextResponse.json({ error: "This event has ended" }, { status: 409 });
  }
  if (event.reserved >= event.capacity) {
    return NextResponse.json({ error: "This event is sold out" }, { status: 409 });
  }

  await run(
    "INSERT INTO reservations (event_id, created_at) VALUES (?, ?)",
    [eventId, new Date().toISOString()],
  );
  return NextResponse.json({ reserved: true }, { status: 201 });
}
