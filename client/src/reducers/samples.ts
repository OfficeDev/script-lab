import { samples, ISamplesAction } from '../actions'
import { getType } from 'typesafe-actions'

const initialMetadata = []
const metadata = (state = initialMetadata, action: ISamplesAction) => {
  switch (action.type) {
    case getType(samples.fetchMetadata.success):
      return action.payload
    case getType(samples.fetchMetadata.failure):
      return initialMetadata
    default:
      return state
  }
}

export default metadata

// selectors
const getByGroup = state =>
  state.reduce(
    (byGroup, sample) => ({
      ...byGroup,
      [sample.group]: [...(byGroup[sample.group] || []), sample],
    }),
    {},
  )

export const selectors = {
  getByGroup,
}
