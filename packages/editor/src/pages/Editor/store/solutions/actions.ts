import {
  createAction,
  createAsyncAction,
} from '../../../../utils/typesafe-telemetry-actions';

export const create = createAction('SOLUTIONS_CREATE_NEW')({
  getTelemetryData: type => ({ type }),
});

export const add = createAction('SOLUTIONS_ADD')<ISolution>();

interface IEditProps {
  id: string;
  solution?: Partial<IEditableSolutionProperties>;
  fileId?: string;
  file?: Partial<IEditableFileProperties>;
  timestamp?: number; // will be set by action creator
}

export const edit = createAction('SOLUTIONS_EDIT')<IEditProps>({
  getTelemetryData: (type, payload) => ({ type, solutionId: payload.id }),
  addTimestamp: true,
});

export const updateLastOpened = createAction('SOLUTIONS_UPDATE_LAST_OPENED')<{
  solutionId: string;
  fileId: string;
  timestamp?: number;
}>({ addTimestamp: true });

// NOTE: remove is called from UI, it handles multiple things inside sagas
// delete is what remove will call which will ultimately delete the solution from redux's state
export const remove = createAction('SOLUTIONS_REMOVE')<ISolution>({
  getTelemetryData: (type, payload) => ({ type, solutionId: payload.id }),
});

export const deleteFromState = createAction('SOLUTIONS_DELETE')<ISolution>();

export const getDefault = createAsyncAction(
  'GET_DEFAULT_SAMPLE_REQUEST',
  'GET_DEFAULT_SAMPLE_SUCCESS',
  'GET_DEFAULT_SAMPLE_FAILURE',
)<void, { solution: ISolution }, Error>();

export const updateOptions = createAction('SOLUTIONS_UPDATE_OPTIONS')<{
  id: string;
  options: Partial<ISolutionOptions>;
}>();

export const scriptNeedsParsing = createAction('SOLUTION_SCRIPT_NEEDS_PARSING')<{
  solution: ISolution;
  file: IFile;
}>();
