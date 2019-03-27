import { TelemetryEvent } from 'oteljs/TelemetryEvent';
//import { DataFieldType } from 'oteljs/DataFieldType';
import { DataField } from 'oteljs/DataField';
//import { DataCategories, DiagnosticLevel } from 'oteljs/EventFlagsProperties';

import { getCurrentEnv } from '../environment';

declare namespace Office {
    function sendTelemetryEvent(event: TelemetryEvent);
}

export function sendTelemetryEvent(
  name: 'Editor.Loaded',
  additionalDataFields: DataField[],
) {
  let telemetryEvent: TelemetryEvent = {
    eventName: 'Office.ScriptLab.' + name,
    eventFlags: {
      dataCategories: 2,
      diagnosticLevel: 100
    },
    dataFields: [
      ...additionalDataFields,
      {
        name: 'Environment',
        dataType: 0,
        value: getCurrentEnv(),
      },
    ],
    telemetryProperties: {
      ariaTenantToken:
        '2b76429bb1b7429c8a2e87e51aa8af6b-0dc6a93e-bf04-44c5-9cf5-8b0cd229d414-7620',
      nexusTenantToken: 1783,
    },
  };

  Office.sendTelemetryEvent(telemetryEvent);
}