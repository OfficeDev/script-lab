import { IState } from '../reducer'
import { createSelector } from 'reselect'
import { Utilities, HostType } from '@microsoft/office-js-helpers'

export const get = (state: IState): string => state.host
export const getIsWeb = (state?: IState): boolean => Utilities.host === HostType.WEB
export const getIsRunnableOnThisHost = createSelector(
  [getIsWeb, get],
  (isWeb, host) => (isWeb ? host === HostType.WEB : host !== HostType.WEB),
)
