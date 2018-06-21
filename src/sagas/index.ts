import { put, takeEvery, select, call } from 'redux-saga/effects'
import uuidv4 from 'uuid'

import {
  addSolution,
  createNewSolution,
  getSolutionsMap,
  ISolution,
} from '../stores/solutions'
import { defaultScriptLabFiles, addFiles } from '../stores/files'
import { openSolution, changeActiveSolution, changeActiveFile } from '../stores/selection'
import { importGist } from '../stores/github'
import { readRawGist, getRawYamlUrl, getGistId } from '../services/github'
import { IFile } from '../stores/files'

// TODO: Figure out how to organize all this stuff well

// TODO: refactor this code to allow so that all other places dont need to addSolution, and change active Files
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

// TODO: is export needed? (probably not)
export function* importGistSideEffect(gistUrl: string) {
  try {
    // TODO: @Sophia import code from '../services/github' and create Solution's and files out of the response
    // helpful: actions/snippet.ts from script-lab
    let newSolution = { id: uuidv4() }
    const newFiles = [{ id: uuidv4() }]
    console.log('lol')
    const gistUrlString = gistUrl as `string`
    console.log(gistUrlString)

    // from: importGist in original ImportGist.tsx on branch testing
    const gistId = getGistId(gistUrl)
    console.log(gistId)
    const rawUrl = yield call(getRawYamlUrl, gistId)

    // create a new solution
    newSolution = yield call(readRawGist, rawUrl)
    // add solution to files array
    newFiles.push(newSolution)

    yield put(addSolution(newSolution))
    yield put(changeActiveSolution(newSolution.id))
    yield put(changeActiveFile(newFiles[0].id))
  } catch (e) {
    // TODO: implement some sort of error action that can display a modal when an error occurs
    return
  }
}

export default function* createSolutionSaga() {
  // TODO: figure out if this is a best practice or antipattern
  yield takeEvery(createNewSolution, createSolutionSideEffect)
  yield takeEvery(openSolution, openSolutionSideEffect)
  yield takeEvery(importGist, importGistSideEffect)
}
