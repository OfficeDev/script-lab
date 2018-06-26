import { samples, ISamplesAction } from '../actions'
import { getType } from 'typesafe-actions'

const metadata = (state = [], action: ISamplesAction) => {
  switch (action.type) {
    case getType(samples.fetchMetadata.success):
      return action.payload
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
