import { getType } from 'typesafe-actions'
import { config, IConfigAction } from '../actions'
import { combineReducers } from 'redux'
import { Utilities, HostType } from '@microsoft/office-js-helpers'

const host = (state: string = Utilities.host, action: IConfigAction) => {
  switch (action.type) {
    case getType(config.changeHost):
      return Object.keys(HostType)
        .map(k => HostType[k])
        .includes(action.payload)
        ? action.payload
        : state
    default:
      return state
  }
}

export default combineReducers({ host })

export const getHost = (state): string => state.host
export const getIsWeb = (): boolean => Utilities.host === HostType.WEB

export const selectors = {
  getHost,
  getIsWeb,
}
