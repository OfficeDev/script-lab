import { getType } from 'typesafe-actions'
import { host as hostActions, IHostAction } from '../actions'
import { Utilities, HostType } from '@microsoft/office-js-helpers'

export type IState = string

const host = (state: IState = Utilities.host, action: IHostAction) => {
  switch (action.type) {
    case getType(hostActions.change):
      return Object.keys(HostType)
        .map(k => HostType[k])
        .includes(action.payload)
        ? action.payload
        : state
    default:
      return state
  }
}

export default host
