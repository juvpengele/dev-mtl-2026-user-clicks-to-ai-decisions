import { trace } from "@opentelemetry/api";
import {
  loadEvents,
  parseEventsQueryMode,
  type EventWithSeatsLeft,
} from "@project-x/shared";
import { tracedDb } from "./database";

export async function getObservableEvents(
  route: string,
): Promise<EventWithSeatsLeft[]> {
  const mode = parseEventsQueryMode(process.env.EVENTS_QUERY_MODE);
  return trace.getTracer("project-x").startActiveSpan(
    "getEventsWithSeatsLeft",
    {
      attributes: {
        "http.route": route,
        "code.function.name": "getEventsWithSeatsLeft",
        "project_x.events_query_mode": mode,
      },
    },
    async (span) => {
      try {
        const events = await loadEvents(tracedDb, mode);
        span.setAttribute("project_x.events_count", events.length);
        return events;
      } finally {
        span.end();
      }
    },
  );
}
