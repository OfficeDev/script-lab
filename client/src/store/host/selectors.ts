import { IState } from '../reducer'
import { Utilities, HostType } from '@microsoft/office-js-helpers'

export const get = (state: IState): string => state.host
export const getIsWeb = (state?: IState): boolean => Utilities.host === HostType.WEB
