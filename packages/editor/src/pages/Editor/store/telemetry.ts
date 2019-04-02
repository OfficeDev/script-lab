import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';
import { ScriptLabError } from 'common/lib/utilities/error';
import omit from 'lodash/omit';
import { sendTelemetryEvent } from 'common/lib/utilities/telemetry';
import { stringifyPlusPlus } from 'common/lib/utilities/string';

export const addTelemetryLoggingToDispatch = store => {
  const rawDispatch = store.dispatch;
  return action => {
    if (!action) {
      invokeGlobalErrorHandler(
        new ScriptLabError('[Dev only] Unexpected error, action is undefined!'),
      );
      console.log('Previous state', store.getState());
    }

    if (action.meta && action.meta.getTelemetryData) {
      const data = action.meta.getTelemetryData(action.type, action.payload);
      const eventName = convertActionTypeToEventName(data.type);
      const remainingData = omit(data, ['type']);
      sendTelemetryEvent(
        eventName,
        Object.keys(remainingData).map(key => {
          const value = remainingData[key];
          switch (typeof value) {
            case 'number':
              return oteljs.makeDoubleDataField(key, value);

            case 'boolean':
              return oteljs.makeBooleanDataField(key, value);

            case 'string':
              return oteljs.makeStringDataField(key, value);

            default:
              return oteljs.makeStringDataField(key, stringifyPlusPlus(value));
          }
        }),
      );
    }

    const returnValue = rawDispatch(action);
    return returnValue;
  };
};

function convertActionTypeToEventName(actionType: string): string {
  return actionType.replace('_', '/');
}
