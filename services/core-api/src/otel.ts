import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ConsoleSpanExporter, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { logger } from './lib/logger.js';

const otelEnabled = process.env.OTEL_ENABLED !== 'false';
let sdk: NodeSDK | undefined;

export async function startOtel(): Promise<void> {
  if (!otelEnabled) {
    logger.info('OpenTelemetry disabled (OTEL_ENABLED=false)');
    return;
  }

  sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'core-api',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
    }),
    traceExporter: new ConsoleSpanExporter(),
    spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
    instrumentations: getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fastify': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
      },
    }),
  });

  await sdk.start();
  logger.info('OpenTelemetry started (ConsoleSpanExporter)');
}

export async function shutdownOtel(): Promise<void> {
  if (!sdk) return;
  await sdk.shutdown();
  logger.info('OpenTelemetry shut down');
}
