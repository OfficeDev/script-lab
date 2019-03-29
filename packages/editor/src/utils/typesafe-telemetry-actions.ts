import { createAction as defaultCreateAction } from 'typesafe-actions';

interface ITelemetryMetadata {
  eventName: string;
}

interface IMetadata {
  telemetry?: ITelemetryMetadata;
}

interface ICreateActionOptions {
  shouldSendTelemetry?: boolean;
  addTimestamp?: boolean;
}

const defaultOptions = { shouldSendTelemetry: false, addTimestamp: false };

export function createAction<T extends string>(actionType: T) {
  return <P = void>(options: ICreateActionOptions = defaultOptions) => {
    const meta: IMetadata = options.shouldSendTelemetry
      ? { telemetry: convertActionTypeToEventName(actionType) }
      : {};

    return defaultCreateAction(actionType, resolve => {
      return (payload?: P) =>
        resolve(
          options.addTimestamp ? { ...payload, timestamp: Date.now() } : payload,
          meta,
        );
    });
  };
}

export function createAsyncAction<
  T1 extends string,
  T2 extends string,
  T3 extends string
>(requestType: T1, successType: T2, failureType: T3) {
  return <P1 = void, P2 = void, P3 = void>(
    options: ICreateActionOptions = defaultOptions,
  ) => ({
    request: createAction(requestType)<P1>(options),
    success: createAction(successType)<P2>(options),
    failure: createAction(failureType)<P3>(options),
  });
}

////////////////////////////

function convertActionTypeToEventName(actionType: string): { eventName: string } {
  return { eventName: actionType.replace('_', '/') };
}
