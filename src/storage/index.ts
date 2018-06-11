import { normalize } from 'normalizr'
import { solution } from './schema'

import sampleSolution from '../sampleData'

let normalizedData

// TODO: ou can pass the whole initial state tree as a second argument when creating the store. This is useful for hydrating persisted data or data received from the server. However we never recommend building that state tree in your code. The reason is the same: to keep reducers self-sufficient and reusable.

export function getData() {
  const { entities } = normalize(sampleSolution, solution)
  normalizedData = entities
  console.log(normalizedData)
}

export function getInitialSolutions() {
  if (!normalizedData) {
    getData()
  }

  return normalizedData.solutions
}

export function getInitialFiles() {
  if (!normalizedData) {
    getData()
  }

  return normalizedData.files
}

export function getInitialUsers() {
  if (!normalizedData) {
    getData()
  }

  return normalizedData.users
}

export function getInitialSelection() {
  return { solutionId: '123456789', fileId: '123' }
}
