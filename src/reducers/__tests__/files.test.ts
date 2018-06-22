import filesReducer from '../files'
import { files as filesActions } from '../../actions'

export const getExampleFile = (i: number) => ({
  id: `${i}`,
  name: `index${i}.ts`,
  language: 'TypeScript',
  dateCreated: i,
  dateLastModified: 2 * i,
  content: `// hello world ${i}`,
})

export const getStateWith = (indicies: number[]) =>
  indicies.reduce(
    (state, i) => {
      const ex = getExampleFile(i)

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
    expect(filesReducer(getStateWith([]), filesActions.add([getExampleFile(3)]))).toEqual(
      getStateWith([3]),
    )
  })

  test('remove two files', () => {
    expect(
      filesReducer(
        getStateWith([1, 3, 4, 6, 7]),
        filesActions.remove([getExampleFile(4).id, getExampleFile(1).id]),
      ),
    ).toEqual(getStateWith([3, 6, 7]))
  })
})
