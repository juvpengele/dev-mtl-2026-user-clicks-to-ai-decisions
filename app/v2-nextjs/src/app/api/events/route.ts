import { NextRequest, NextResponse } from "next/server";
import { getObservableEvents } from "@/server/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const events = await getObservableEvents("/api/events");
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json(events);

  const event = events.find((candidate) => candidate.id === Number(id));
  return event
    ? NextResponse.json(event)
    : NextResponse.json({ error: "Event not found" }, { status: 404 });
}
