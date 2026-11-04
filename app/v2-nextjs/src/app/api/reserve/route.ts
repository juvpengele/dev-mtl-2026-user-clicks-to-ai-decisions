import { trace } from "@opentelemetry/api";
import { NextRequest, NextResponse } from "next/server";
import { run, tracedDb } from "@/server/database";

export const runtime = "nodejs";

type EventCapacity = { capacity: number; reserved: number };

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
    `SELECT e.capacity, COUNT(r.id) AS reserved
     FROM events e
     LEFT JOIN reservations r ON r.event_id = e.id
     WHERE e.id = ?
     GROUP BY e.id, e.capacity`,
    [eventId],
  );

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
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
