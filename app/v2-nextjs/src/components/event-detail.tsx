"use client";

import type { EventWithSeatsLeft } from "@project-x/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withBrowserSpan } from "@/telemetry/browser";

export function EventDetail({ eventId }: { eventId: number }) {
  const [event, setEvent] = useState<EventWithSeatsLeft>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  async function loadEvent() {
    return withBrowserSpan(
      "page: Load event detail",
      { "ui.route": `/events/${eventId}`, "project_x.event_id": String(eventId) },
      async () => {
        const response = await fetch(`/api/events?id=${eventId}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Event not found");
        setEvent((await response.json()) as EventWithSeatsLeft);
      },
    );
  }

  useEffect(() => {
    loadEvent().catch((error: Error) => setMessage(error.message)).finally(() => setLoading(false));
  }, [eventId]);

  async function reserveSeat() {
    setReserving(true);
    setMessage("");
    try {
      await withBrowserSpan(
        "click: Reserve seat",
        {
          "ui.action": "reserve_seat",
          "project_x.event_id": String(eventId),
          "code.function.name": "reserveSeat",
        },
        async () => {
          const response = await fetch("/api/reserve", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ eventId }),
          });
          const result = (await response.json()) as { error?: string };
          if (!response.ok) throw new Error(result.error ?? "Reservation failed");
        },
      );
      setEvent((current) => current ? { ...current, seatsLeft: current.seatsLeft - 1 } : current);
      setMessage("Your seat is reserved. See you there!");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setReserving(false);
    }
  }

  if (loading) return <main className="detail-shell"><div className="events-state"><span className="pulse" />Loading event…</div></main>;
  if (!event) return <main className="detail-shell"><p className="events-state error">{message}</p></main>;

  const date = new Date(event.date);
  return (
    <main className="detail-shell">
      <Link href="/" className="back-link">← All events</Link>
      <article className="event-detail">
        <p className="eyebrow">PROJECT X PRESENTS</p>
        <h1>{event.title}</h1>
        <div className="detail-grid">
          <div><span>Date</span><strong>{date.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</strong></div>
          <div><span>Time</span><strong>{date.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}</strong></div>
          <div><span>Availability</span><strong>{event.seatsLeft} seats left</strong></div>
        </div>
        <p className="detail-copy">
          Join builders, operators, and curious minds for an evening of useful ideas and honest conversations.
        </p>
        <button type="button" onClick={reserveSeat} disabled={reserving || event.seatsLeft < 1}>
          {reserving ? "Reserving…" : event.seatsLeft < 1 ? "Sold out" : "Reserve a seat"}
          <span aria-hidden="true">→</span>
        </button>
        {message && <p className="reservation-message" role="status">{message}</p>}
      </article>
    </main>
  );
}
