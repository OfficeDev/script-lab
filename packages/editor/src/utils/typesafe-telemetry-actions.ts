import { createAction as defaultCreateAction } from 'typesafe-actions';

interface ITelemetryMetadata {
  eventName: string;
}

interface IMetadata {
  telemetry?: ITelemetryMetadata;
}

type IGetTelemetryData<T, P> = (actionType: T, payload: P) => object;

interface ICreateActionOptions<T, P> {
  addTimestamp?: boolean;
  getTelemetryData?: IGetTelemetryData<T, P>;
}

const defaultOptions: ICreateActionOptions<null, null> = {
  getTelemetryData: null,
  addTimestamp: false,
};

export function createAction<T extends string>(actionType: T) {
  return <P = void>(options: ICreateActionOptions<T, P> = defaultOptions) => {
    const { getTelemetryData } = options;
    const meta = getTelemetryData ? { getTelemetryData } : {};

    return defaultCreateAction(actionType, resolve => {
      return (payload?: P) =>
        resolve(
          options.addTimestamp ? { ...payload, timestamp: Date.now() } : payload,
          meta,
        );
    });
  };
}

interface ICreateAsyncActionOptions<T1, T2, T3, P1, P2, P3> {
  getTelemetryData?: {
    request?: IGetTelemetryData<T1, P1>;
    success?: IGetTelemetryData<T2, P2>;
    failure?: IGetTelemetryData<T3, P3>;
  };
}

const defaultAsyncOptions: ICreateAsyncActionOptions<
  null,
  null,
  null,
  null,
  null,
  null
> = {
  getTelemetryData: {},
};

export function createAsyncAction<
  T1 extends string,
  T2 extends string,
  T3 extends string
>(requestType: T1, successType: T2, failureType: T3) {
  return <P1 = void, P2 = void, P3 = void>(
    options: ICreateAsyncActionOptions<T1, T2, T3, P1, P2, P3> = defaultAsyncOptions,
  ) => {
    const { request, success, failure } = options.getTelemetryData;
    return {
      request: createAction(requestType)<P1>({ getTelemetryData: request }),
      success: createAction(successType)<P2>({ getTelemetryData: success }),
      failure: createAction(failureType)<P3>({ getTelemetryData: failure }),
    };
  };
}
