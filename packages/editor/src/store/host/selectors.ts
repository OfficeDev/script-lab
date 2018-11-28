import { IState } from '../reducer';
import { createSelector } from 'reselect';
import { Utilities, HostType } from '@microsoft/office-js-helpers';

export const get = (state: IState): string => state.host;
export const getIsWeb = (state?: IState): boolean => Utilities.host === HostType.WEB;
export const getIsInAddin = (state?: IState): boolean =>
  Utilities.isAddin && !window.location.href.includes('isDialog');
export const getIsRunnableOnThisHost = createSelector(
  [getIsWeb, get],
  (isWeb, host) =>
    host === HostType.OUTLOOK
      ? false
      : isWeb
      ? host === HostType.WEB
      : host !== HostType.WEB,
);
