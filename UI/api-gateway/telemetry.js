import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "grpc://otel-collector:4317"
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

// Async IIFE ensures sdk.start() works properly
(async () => {
  try {
    await sdk.start();
    console.log("OpenTelemetry initialized");
  } catch (error) {
    console.error("Error initializing OpenTelemetry:", error);
  }
})();

// Graceful shutdown
process.on("SIGTERM", async () => {
  try {
    await sdk.shutdown();
    console.log("OpenTelemetry terminated");
  } catch (error) {
    console.error("Error terminating OpenTelemetry:", error);
  }
});
