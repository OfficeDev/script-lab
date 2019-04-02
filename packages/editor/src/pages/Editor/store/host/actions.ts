import { createAction } from '../../../../utils/typesafe-telemetry-actions';

export const change = createAction('HOST_CHANGE')<string>({
  getTelemetryData: (type, payload) => ({ type, host: payload }),
});
