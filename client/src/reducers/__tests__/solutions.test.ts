import solutionsReducer from '../solutions'
import { solutions as solutionsActions } from '../../actions'

export const getExampleSolution = (i: number): ISolution => ({
  id: `${i}`,
  name: `Example Solution ${i}`,
  host: 'WEB',
  dateCreated: i,
  dateLastModified: 2 * i,
  files: [`${i}${i}${i}`, `${i + 1}${i + 1}${i + 1}`, `${i + 2}${i + 2}${i + 2}`],
  libraries: [],
})

export const getStateWith = (indicies: number[]) =>
  indicies.reduce(
    (state, i) => {
      const ex = getExampleSolution(i)

      state.byId[ex.id] = ex
      state.allIds.push(ex.id)

      return state
    },
    {
      byId: {},
      allIds: [] as string[],
    },
  )

describe('solutions reducer', () => {
  test('add solution to empty state', () => {
    expect(
      solutionsReducer(getStateWith([]), solutionsActions.add(getExampleSolution(1))),
    ).toEqual(getStateWith([1]))
  })

  test('add solution to non-empty state', () => {
    expect(
      solutionsReducer(getStateWith([1]), solutionsActions.add(getExampleSolution(2))),
    ).toEqual(getStateWith([1, 2]))
  })

  test('remove solution', () => {
    expect(
      solutionsReducer(
        getStateWith([1, 2]),
        solutionsActions.remove(getExampleSolution(2)),
      ),
    ).toEqual(getStateWith([1]))
  })

  test('edit solution', () => {
    const newName = 'My New Name'
    const actionToDispatch = solutionsActions.edit(getExampleSolution(1).id, {
      name: newName,
    })
    const { timestamp } = actionToDispatch.payload

    const expectedState = getStateWith([1, 2])
    expectedState.byId[getExampleSolution(1).id].name = newName
    expectedState.byId[getExampleSolution(1).id].dateLastModified = timestamp
    expect(solutionsReducer(getStateWith([1, 2]), actionToDispatch)).toEqual(
      expectedState,
    )
  })
})
