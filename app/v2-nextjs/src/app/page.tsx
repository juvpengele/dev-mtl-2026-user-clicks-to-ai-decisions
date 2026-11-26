import { EventsList } from "@/components/events-list";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">SEPTEMBER 2026 — JANUARY 2027</p>
        <h1>Find your next<br />big idea.</h1>
        <p className="hero-copy">
          Practical talks, thoughtful people, and one seat with your name on it.
        </p>
      </section>
      <EventsList />
    </main>
  );
}
