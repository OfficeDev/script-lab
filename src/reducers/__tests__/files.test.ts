import filesReducer from '../files'
import { files as filesActions } from '../../actions'
import { IFile } from '../../interfaces'

const NUM_FILES = 10
const exampleFiles: IFile[] = Array.from(Array(NUM_FILES).keys()).map(i => ({
  id: `${i}`,
  name: `index{i}.ts`,
  dateCreated: i,
  dateLastModified: 2 * i,
  content: `// hello world ${i}`,
}))

const emptyState: { byId: { [id: string]: IFile }; allIds: string[] } = {
  byId: {},
  allIds: [],
}

// TODO: move this logic into the solutions reducer test as well
const getStateWith = (indicies: number[]) =>
  indicies.reduce(
    (state, i) => {
      const ex = exampleFiles[i]

      state.byId[ex.id] = ex
      state.allIds.push(ex.id)

      return state
    },
    {
      byId: {},
      allIds: [] as string[],
    },
  )

describe('files reducer', () => {
  // TODO: add more tests
  test('add single file to empty state', () => {
    expect(filesReducer(emptyState, filesActions.add([exampleFiles[3]]))).toEqual(
      getStateWith([3]),
    )
  })

  test('remove two files', () => {
    expect(
      filesReducer(
        getStateWith([1, 3, 4, 6, 7]),
        filesActions.remove([exampleFiles[4].id, exampleFiles[1].id]),
      ),
    ).toEqual(getStateWith([3, 6, 7]))
  })
})
