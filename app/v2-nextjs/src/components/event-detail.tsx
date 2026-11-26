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

  async function respondToEvent() {
    if (!event) return;
    setReserving(true);
    setMessage("");
    try {
      await withBrowserSpan(
        event.format === "online" ? "click: Attend online" : "click: Reserve seat",
        {
          "ui.action": event.format === "online" ? "attend_online" : "reserve_seat",
          "project_x.event_id": String(eventId),
          "code.function.name": "respondToEvent",
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
      setMessage(
        event.format === "online"
          ? "You're registered. Your access link is on its way!"
          : "Your seat is reserved. See you there!",
      );
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setReserving(false);
    }
  }

  if (loading) return <main className="detail-shell"><div className="events-state"><span className="pulse" />Loading event…</div></main>;
  if (!event) return <main className="detail-shell"><p className="events-state error">{message}</p></main>;

  const date = new Date(event.date);
  const isPast = date.getTime() < Date.now();
  const isOnline = event.format === "online";
  const isSoldOut = event.seatsLeft < 1;
  const buttonLabel = isPast
    ? "Unavailable — event ended"
    : reserving
      ? isOnline ? "Registering…" : "Reserving…"
      : isSoldOut
        ? "Sold out"
        : isOnline ? "Attend online" : "Reserve a seat";
  return (
    <main className="detail-shell">
      <Link href="/" className="back-link">← All events</Link>
      <article className="event-detail">
        <div className="detail-kicker">
          <p className="eyebrow">PROJECT X PRESENTS</p>
          {isOnline && <span className="detail-format">Online event</span>}
          {isPast && <span className="detail-past">Past event</span>}
        </div>
        <h1>{event.title}</h1>
        <div className="detail-grid">
          <div><span>Date</span><strong>{date.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</strong></div>
          <div><span>Time</span><strong>{date.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}</strong></div>
          <div><span>Location</span><strong>{isOnline ? "Online" : event.city}</strong></div>
          <div><span>Availability</span><strong>{isPast ? "Event ended" : `${event.seatsLeft} seats left`}</strong></div>
        </div>
        <div className="detail-content">
          <div>
            <p className="detail-label">About this event</p>
            <p className="detail-copy">{event.description}</p>
          </div>
          <aside className="speaker-card">
            <span>Speaker</span>
            <strong>{event.speaker}</strong>
            <p>Practitioner, builder, and Project X community contributor.</p>
          </aside>
        </div>
        <button type="button" onClick={respondToEvent} disabled={reserving || isPast || isSoldOut}>
          {buttonLabel}
          <span aria-hidden="true">→</span>
        </button>
        {message && <p className="reservation-message" role="status">{message}</p>}
      </article>
    </main>
  );
}
