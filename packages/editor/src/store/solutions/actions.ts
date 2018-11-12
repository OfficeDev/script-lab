import { createAction, createAsyncAction } from 'typesafe-actions';

export const create = createAction('SOLUTIONS_CREATE_NEW');

export const add = createAction('SOLUTIONS_ADD', resolve => {
  return (solution: ISolution) => resolve(solution);
});

export const edit = createAction('SOLUTIONS_EDIT', resolve => {
  return ({
    id,
    solution,
    fileId,
    file,
  }: {
    id: string;
    solution?: Partial<IEditableSolutionProperties>;
    fileId?: string;
    file?: Partial<IEditableFileProperties>;
  }) => resolve({ id, solution, fileId, file, timestamp: Date.now() });
});

export const remove = createAction('SOLUTIONS_REMOVE', resolve => {
  return (solution: ISolution) => resolve(solution);
});

export const getDefault = createAsyncAction(
  'GET_DEFAULT_SAMPLE_REQUEST',
  'GET_DEFAULT_SAMPLE_SUCCESS',
  'GET_DEFAULT_SAMPLE_FAILURE',
)<void, { solution: ISolution }, Error>();

export const updateOptions = createAction('SOLUTIONS_UPDATE_OPTIONS', resolve => {
  return (props: { solution: ISolution; options: Partial<ISolutionOptions> }) =>
    resolve(props);
});

export const scriptNeedsParsing = createAction(
  'SOLUTION_SCRIPT_NEEDS_PARSING',
  resolve => {
    return (props: { solution: ISolution; file: IFile }) => resolve(props);
  },
);
