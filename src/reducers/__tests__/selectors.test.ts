import { selectors } from '../index'

import {
  getExampleSolution,
  getStateWith as getSolutionsStateWith,
} from './solutions.test'
import { getExampleFile, getStateWith as getFilesStateWith } from './files.test'

const solutionIds = [1, 10, 100]
const fileIds = [111, 222, 333, 101010, 111111, 12121212, 100100100, 101101101, 102102102]

const state = {
  solutions: getSolutionsStateWith(solutionIds),
  files: getFilesStateWith(fileIds),
}

describe('selectors', () => {
  it('should be able to get a solution', () => {
    const id = 10
    expect(selectors.solutions.get(state, `${id}`)).toEqual(getExampleSolution(id))
  })
})
