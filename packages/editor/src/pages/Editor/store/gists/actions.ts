import { createAsyncAction } from '../../../../utils/typesafe-telemetry-actions';
import { ConflictResolutionOptions } from '../../../../interfaces/enums';

// used for import
export const importSnippet = createAsyncAction(
  'IMPORT_GIST_REQUEST',
  'IMPORT_GIST_SUCCESS',
  'IMPORT_GIST_FAILURE',
)<{ gistId?: string; gist?: string }, { solution: ISolution }, Error>({
  getTelemetryData: {
    request: (type, { gistId }) => ({ type, gistId }),
    success: (type, payload) => ({ type }),
    failure: (type, payload) => ({ type, error: payload }),
  },
});

export const create = createAsyncAction(
  'CREATE_GIST_REQUEST',
  'CREATE_GIST_SUCCESS',
  'CREATE_GIST_FAILURE',
)<
  { solutionId: string; isPublic: boolean },
  { gist: IGithubGistPayload; solution: ISolution },
  Error
>({
  getTelemetryData: {
    request: (type, { solutionId, isPublic }) => ({ type, solutionId, isPublic }),
    success: (type, payload) => ({ type, gistId: payload.gist.id }),
    failure: (type, payload) => ({ type, error: payload }),
  },
});

export const update = createAsyncAction(
  'UPDATE_GIST_REQUEST',
  'UPDATE_GIST_SUCCESS',
  'UPDATE_GIST_FAILURE',
)<{ solutionId: string }, { gist: IGithubGistPayload }, Error>({
  getTelemetryData: {
    request: (type, payload) => ({ type, solutionId: payload.solutionId }),
    success: type => ({ type }),
    failure: (type, payload) => ({ type, error: payload }),
  },
});

export const fetchMetadata = createAsyncAction(
  'FETCH_GIST_METADATA_REQUEST',
  'FETCH_GIST_METADATA_SUCCESS',
  'FETCH_GIST_METADATA_FAILURE',
)<void, ISharedGistMetadata[], { shouldLogUserOut: boolean }>({
  getTelemetryData: {
    request: type => ({ type }),
    success: type => ({ type }),
    failure: type => ({ type }),
  },
});

export const get = createAsyncAction(
  'GET_GIST_REQUEST',
  'GET_GIST_SUCCESS',
  'GET_GIST_FAILURE',
)<
  {
    gistId: string;
    rawUrl: string;
    conflictResolution?: {
      type: ConflictResolutionOptions;
      existingSolution: ISolution;
    };
  },
  { solution: ISolution },
  Error
>({
  getTelemetryData: {
    request: (type, { gistId, rawUrl }) => ({ type, gistId, rawUrl }),
    success: type => ({ type }),
    failure: (type, payload) => ({ type, error: payload }),
  },
});
