import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrowserTelemetryProvider } from "@/telemetry/browser-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project X — Tech events",
  description: "Reserve your seat at the next great tech event.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BrowserTelemetryProvider>
          <header className="site-header">
            <Link className="brand" href="/" aria-label="Project X home">
              <span className="brand-mark" aria-hidden="true">X</span>
              <span>Project X</span>
            </Link>
            <span className="header-note">Tech events worth showing up for</span>
          </header>
          {children}
          <footer>Project X · Montréal · Built for curious people</footer>
        </BrowserTelemetryProvider>
      </body>
    </html>
  );
}
