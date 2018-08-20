import { IState } from '../reducer'
import { Utilities, HostType } from '@microsoft/office-js-helpers'

export const get = (state: IState): string => state.host
export const getIsWeb = (state?: IState): boolean => Utilities.host === HostType.WEB
export const getIsRunnableOnThisHost = (state: IState) =>
  getIsWeb(state) ? get(state) === HostType.WEB : get(state) !== HostType.WEB
