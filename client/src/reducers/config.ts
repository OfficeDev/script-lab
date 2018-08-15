import { getType } from 'typesafe-actions'
import { Utilities, HostType } from '@microsoft/office-js-helpers'
import theme from '../theme'

const host = (state: string = Utilities.host, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default host

export const getHost = (state): string => state.host

export const selectors = {}
