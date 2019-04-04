import { createAsyncAction } from '../../../../utils/typesafe-telemetry-actions';

export const fetchMetadata = createAsyncAction(
  'FETCH_ALL_SAMPLES_METADATA_REQUEST',
  'FETCH_ALL_SAMPLES_METADATA_SUCCESS',
  'FETCH_ALL_SAMPLES_METADATA_FAILURE',
)<void, ISampleMetadata[], Error>();

export const get = createAsyncAction(
  'GET_SAMPLE_REQUEST',
  'GET_SAMPLE_SUCCESS',
  'GET_SAMPLE_FAILURE',
)<{ rawUrl: string }, { solution: ISolution }, Error>({
  getTelemetryData: {
    request: (type, payload) => ({ type, url: payload.rawUrl }),
    success: (type, payload) => ({ type, sampleId: payload.solution.name }),
    failure: (type, payload) => ({ type, payload }),
  },
});
