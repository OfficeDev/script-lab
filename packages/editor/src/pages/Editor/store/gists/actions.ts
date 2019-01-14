import { createAsyncAction } from 'typesafe-actions';
import { ConflictResolutionOptions } from '../../../../interfaces/enums';

// used for import
export const importSnippet = createAsyncAction(
  'IMPORT_GIST_REQUEST',
  'IMPORT_GIST_SUCCESS',
  'IMPORT_GIST_FAILURE',
)<{ gistId?: string; gist?: string }, { solution: ISolution }, Error>();

export const create = createAsyncAction(
  'CREATE_GIST_REQUEST',
  'CREATE_GIST_SUCCESS',
  'CREATE_GIST_FAILURE',
)<
  { solutionId: string; isPublic: boolean },
  { gist: IGithubGistPayload; solution: ISolution },
  Error
>();

export const update = createAsyncAction(
  'UPDATE_GIST_REQUEST',
  'UPDATE_GIST_SUCCESS',
  'UPDATE_GIST_FAILURE',
)<{ solutionId: string }, { gist: IGithubGistPayload }, Error>();

export const fetchMetadata = createAsyncAction(
  'FETCH_GIST_METADATA_REQUEST',
  'FETCH_GIST_METADATA_SUCCESS',
  'FETCH_GIST_METADATA_FAILURE',
)<void, ISharedGistMetadata[], Error>();

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
>();
