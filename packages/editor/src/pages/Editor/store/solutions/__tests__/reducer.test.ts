import reducer, { IState } from '../reducer';
import { solutions as solutionsActions } from '../../actions';

export const getExampleFile = (i: number) => ({
  id: `${i}`,
  name: `index${i}.ts`,
  language: 'TypeScript',
  dateCreated: i,
  dateLastModified: 2 * i,
  dateLastOpened: 3 * i,
  content: `// hello world ${i}`,
});

export const getExampleSolution = (i: number): ISolution => ({
  id: `${i}`,
  name: `Example Solution ${i}`,
  host: 'WEB',
  dateCreated: i,
  dateLastModified: 2 * i,
  dateLastOpened: 3 * i,
  options: {},
  files: [getExampleFile(i + 1)],
});

export const getStateWith = (indicies: number[]) =>
  indicies.reduce(
    (state, i) => {
      const ex = getExampleSolution(i);
      const file = ex.files[0];

      return {
        metadata: {
          ...state.metadata,
          [ex.id]: { ...ex, files: ex.files.map(file => file.id) },
        },
        files: {
          ...state.files,
          [file.id]: file,
        },
      };
    },
    {
      metadata: {},
      files: {},
    },
  );

describe('solutions reducer', () => {
  test('add solution to empty state', () => {
    expect(
      reducer(getStateWith([]), solutionsActions.add(getExampleSolution(1))),
    ).toEqual(getStateWith([1]));
  });

  test('add solution to non-empty state', () => {
    expect(
      reducer(getStateWith([1]), solutionsActions.add(getExampleSolution(2))),
    ).toEqual(getStateWith([1, 2]));
  });

  test('remove solution', () => {
    expect(
      reducer(getStateWith([1, 2]), solutionsActions.remove(getExampleSolution(2))),
    ).toEqual(getStateWith([1]));
  });

  test('edit solution', () => {
    const newName = 'My New Name';
    const actionToDispatch = solutionsActions.edit({
      id: getExampleSolution(1).id,
      solution: {
        name: newName,
      },
    });
    const { timestamp } = actionToDispatch.payload;

    const expectedState = getStateWith([1, 2]);
    expectedState.metadata[getExampleSolution(1).id].name = newName;
    expectedState.metadata[getExampleSolution(1).id].dateLastModified = timestamp;
    expect(reducer(getStateWith([1, 2]), actionToDispatch)).toEqual(expectedState);
  });

  test('edit a file', () => {
    const newContent = '// hello world, how are you?';
    const solution = getExampleSolution(1);
    const file = solution.files[0];
    const actionToDispatch = solutionsActions.edit({
      id: solution.id,
      fileId: file.id,
      file: {
        content: newContent,
      },
    });
    const { timestamp } = actionToDispatch.payload;

    const expectedState = getStateWith([1, 2]);
    expectedState.metadata[solution.id].dateLastModified = timestamp;
    expectedState.files[file.id].content = newContent;
    expectedState.files[file.id].dateLastModified = timestamp;
    expect(reducer(getStateWith([1, 2]), actionToDispatch)).toEqual(expectedState);
  });
});
