import { getType } from 'typesafe-actions'
import { combineReducers } from 'redux'
import { Utilities, HostType } from '@microsoft/office-js-helpers'

const host = (state: string = Utilities.host, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const isWeb = (state: boolean = Utilities.host === HostType.WEB, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default combineReducers({ host, isWeb })

export const getHost = (state): string => state.host
export const getIsWeb = (state): boolean => state.isWeb

export const selectors = {
  getHost,
  getIsWeb,
}
