import { normalize } from 'normalizr'
import { solution } from './schema'

import sampleSolution from '../sampleData'

let normalizedData

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
