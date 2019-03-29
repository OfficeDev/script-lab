import { createAction, createAsyncAction } from 'typesafe-actions';

export const create = createAction('SOLUTIONS_CREATE_NEW', resolve => {
  return () => resolve(null, { telemetry: { eventName: 'Editor.SnippetAdded' } });
});

export const add = createAction('SOLUTIONS_ADD', resolve => {
  return (solution: ISolution) => resolve(solution);
});

interface IEditProps {
  id: string;
  solution?: Partial<IEditableSolutionProperties>;
  fileId?: string;
  file?: Partial<IEditableFileProperties>;
}

export const edit = createAction('SOLUTIONS_EDIT', resolve => {
  return ({ id, solution, fileId, file }: IEditProps) =>
    resolve(
      { id, solution, fileId, file, timestamp: Date.now() },
      { telemetry: { eventName: 'Editor.SnippetEdited' } },
    );
});

export const updateLastOpened = createAction('SOLUTIONS_UPDATE_LAST_OPENED', resolve => {
  return ({ solutionId, fileId }) =>
    resolve({ solutionId, fileId, timestamp: Date.now() });
});

// NOTE: remove is called from UI, it handles multiple things inside sagas
// delete is what remove will call which will ultimately delete the solution from redux's state
export const remove = createAction('SOLUTIONS_REMOVE', resolve => {
  return (solution: ISolution) =>
    resolve(solution, { telemetry: { eventName: 'Editor.SnippetDeleted' } });
});

export const deleteFromState = createAction('SOLUTIONS_DELETE', resolve => {
  return (solution: ISolution) => resolve(solution);
});

export const getDefault = createAsyncAction(
  'GET_DEFAULT_SAMPLE_REQUEST',
  'GET_DEFAULT_SAMPLE_SUCCESS',
  'GET_DEFAULT_SAMPLE_FAILURE',
)<void, { solution: ISolution }, Error>();

export const updateOptions = createAction('SOLUTIONS_UPDATE_OPTIONS', resolve => {
  return (props: { id: string; options: Partial<ISolutionOptions> }) => resolve(props);
});

export const scriptNeedsParsing = createAction(
  'SOLUTION_SCRIPT_NEEDS_PARSING',
  resolve => {
    return (props: { solution: ISolution; file: IFile }) => resolve(props);
  },
);
