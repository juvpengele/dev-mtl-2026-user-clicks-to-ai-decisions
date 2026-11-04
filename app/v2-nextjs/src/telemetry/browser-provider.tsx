"use client";

import { useEffect, type ReactNode } from "react";
import { initializeBrowserTelemetry } from "./browser";

export function BrowserTelemetryProvider({ children }: { children: ReactNode }) {
  useEffect(() => initializeBrowserTelemetry(), []);
  return children;
}
