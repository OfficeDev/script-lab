import { getCurrentEnv } from '../environment';

let telemetryLogger: oteljs.TelemetryLogger;

class OfficeJsSink implements oteljs.TelemetrySink {
  sendTelemetryEvent(event: oteljs.TelemetryEvent) {
    (Office as any).sendTelemetryEvent(event);
  }
}

export function initializeTelemetryLogger() {
  console.info('[Telemetry] Initializing...');
  telemetryLogger = new oteljs.TelemetryLogger();
  telemetryLogger.addSink(new OfficeJsSink());

  telemetryLogger.setTenantTokens({
    Office: {
      ScriptLab: {
        ariaTenantToken:
          '2b76429bb1b7429c8a2e87e51aa8af6b-0dc6a93e-bf04-44c5-9cf5-8b0cd229d414-7620',
        nexusTenantToken: 1783,
      },
    },
  });

  console.info('[Telemetry] Initialized');
}

export function sendTelemetryEvent(
  name: string,
  additionalDataFields: oteljs.DataField[],
) {
  console.info(`[Telemetry] Sending event ${name}...`);

  telemetryLogger.sendTelemetryEvent({
    eventName: 'Office.ScriptLab.' + name,
    eventFlags: {
      dataCategories: oteljs.DataCategories.ProductServiceUsage,
      diagnosticLevel: oteljs.DiagnosticLevel.FullEvent,
    },
    dataFields: [
      ...additionalDataFields,
      oteljs.makeStringDataField('Environment', getCurrentEnv()),
    ],
  });
}
