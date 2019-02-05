import { createAsyncAction } from 'typesafe-actions';

export const fetchMetadata = createAsyncAction(
  'FETCH_ALL_SAMPLES_METADATA_REQUEST',
  'FETCH_ALL_SAMPLES_METADATA_SUCCESS',
  'FETCH_ALL_SAMPLES_METADATA_FAILURE',
)<void, ISampleMetadata[], Error>();

export const get = createAsyncAction(
  'GET_SAMPLE_REQUEST',
  'GET_SAMPLE_SUCCESS',
  'GET_SAMPLE_FAILURE',
)<{ rawUrl: string }, { solution: ISolution }, Error>();
