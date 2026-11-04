import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import packageJson from "../../package.json";

declare global {
  var projectXTelemetryStarted: boolean | undefined;
}

if (!globalThis.projectXTelemetryStarted) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? "project-x",
      [ATTR_SERVICE_VERSION]: process.env.GIT_SHA ?? packageJson.version,
      [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]:
        process.env.DEPLOYMENT_ENVIRONMENT ?? "local",
    }),
    traceExporter: new OTLPTraceExporter(),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": { enabled: false },
      }),
    ],
  });

  sdk.start();
  globalThis.projectXTelemetryStarted = true;
}
