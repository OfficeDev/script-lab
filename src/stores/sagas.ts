import { put, takeEvery, select } from 'redux-saga/effects'
import uuidv4 from 'uuid'

import { addSolution, createNewSolution, getSolutionsMap, ISolution } from './solutions'
import { defaultScriptLabFiles, addFiles } from './files'
import { openSolution, changeActiveSolution, changeActiveFile } from './selection'

export function* createSolutionSideEffect() {
  const newFiles = defaultScriptLabFiles.map(file => ({
    ...file,
    id: uuidv4(),
    dateCreated: Date.now(),
    dateLastModified: Date.now(),
  }))

  yield put(addFiles(newFiles))

  const newSolution: ISolution = {
    id: uuidv4(),
    name: 'Blank Solution',
    dateCreated: Date.now(),
    dateLastModified: Date.now(),
    files: newFiles.map(file => file.id),
  }

  yield put(addSolution(newSolution))
  yield put(changeActiveSolution(newSolution.id))
  yield put(changeActiveFile(newFiles[0].id))
}

export function* openSolutionSideEffect(solutionId: string) {
  const solutionsMap = yield select(getSolutionsMap)
  const { files } = solutionsMap[solutionId]

  yield put(changeActiveSolution(solutionId))
  yield put(changeActiveFile(files[0].id)) // TODO: edgecase
}

export default function* createSolutionSaga() {
  yield takeEvery(createNewSolution, createSolutionSideEffect)
  yield takeEvery(openSolution, openSolutionSideEffect)
}
