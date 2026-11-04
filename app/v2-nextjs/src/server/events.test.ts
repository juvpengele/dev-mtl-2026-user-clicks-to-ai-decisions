import { describe, expect, it } from "vitest";
import { parseEventsQueryMode } from "@project-x/shared";

describe("EVENTS_QUERY_MODE", () => {
  it("defaults safely to the visible N+1 mode", () => {
    expect(parseEventsQueryMode()).toBe("n_plus_one");
    expect(parseEventsQueryMode("anything-else")).toBe("n_plus_one");
  });

  it("accepts the optimized mode", () => {
    expect(parseEventsQueryMode("optimized")).toBe("optimized");
  });
});
