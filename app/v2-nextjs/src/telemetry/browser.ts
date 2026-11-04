"use client";

import { context, SpanStatusCode, trace } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchSpanProcessor, WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

let provider: WebTracerProvider | undefined;

export function initializeBrowserTelemetry() {
  if (typeof window === "undefined" || provider) return;

  const exporterUrl =
    process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT ??
    "http://localhost:4318/v1/traces";

  provider = new WebTracerProvider({
    resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: "project-x-browser" }),
    spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({ url: exporterUrl }))],
  });
  provider.register({ contextManager: new ZoneContextManager() });

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [/^https?:\/\/localhost(?::\d+)?\//, /^\//],
        ignoreUrls: [exporterUrl],
        clearTimingResources: true,
      }),
    ],
  });
}

export async function withBrowserSpan<T>(
  name: string,
  attributes: Record<string, string>,
  operation: () => Promise<T>,
): Promise<T> {
  initializeBrowserTelemetry();
  const tracer = trace.getTracer("project-x-browser");
  const span = tracer.startSpan(name, { attributes });

  try {
    return await context.with(trace.setSpan(context.active(), span), operation);
  } catch (error) {
    span.recordException(error as Error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}
