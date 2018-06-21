import solutionsReducer from '../solutions'
import { solutions as solutionsActions } from '../../actions'
import { ISolution } from '../../interfaces'

const exampleSolution1: ISolution = {
  id: '12345',
  name: 'Example Solution 1',
  dateCreated: 0,
  dateLastModified: 1,
  files: ['111', '222', '333'],
}

const exampleSolution2: ISolution = {
  id: '23456',
  name: 'Example Solution 2',
  description: 'This is an example solution used for testing',
  dateCreated: 1234,
  dateLastModified: 1922,
  files: ['444', '555', '666'],
}

const exampleSolution3: ISolution = {
  id: '34567',
  name: 'Example Solution 3',
  dateCreated: 0,
  dateLastModified: 1,
  files: ['777', '888', '999'],
}

// TODO: type the state?
const emptyState = { byId: {}, allIds: [] }

const stateWithExampleSolution1 = {
  byId: {
    [exampleSolution1.id]: exampleSolution1,
  },
  allIds: [exampleSolution1.id],
}

const stateWithExampleSolutions1and2 = {
  byId: {
    [exampleSolution1.id]: exampleSolution1,
    [exampleSolution2.id]: exampleSolution2,
  },
  allIds: [exampleSolution1.id, exampleSolution2.id],
}

describe('solutions reducer', () => {
  test('add solution to empty state', () => {
    expect(solutionsReducer(emptyState, solutionsActions.add(exampleSolution1))).toEqual(
      stateWithExampleSolution1,
    )
  })

  test('add solution to non-empty state', () => {
    expect(
      solutionsReducer(stateWithExampleSolution1, solutionsActions.add(exampleSolution2)),
    ).toEqual(stateWithExampleSolutions1and2)
  })

  test('remove solution', () => {
    expect(
      solutionsReducer(
        stateWithExampleSolutions1and2,
        solutionsActions.remove(exampleSolution2.id),
      ),
    ).toEqual(stateWithExampleSolution1)
  })

  test('edit solution', () => {
    const newName = 'My New Name'
    const expectedState = stateWithExampleSolutions1and2
    expectedState.byId[exampleSolution1.id].name = newName
    expect(
      solutionsReducer(
        stateWithExampleSolutions1and2,
        solutionsActions.edit(exampleSolution1.id, { name: newName }),
      ),
    ).toEqual(expectedState)
  })
})
