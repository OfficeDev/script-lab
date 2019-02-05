import { IState } from '../reducer';
import { createSelector } from 'reselect';
import { IS_TASK_PANE_WIDTH } from '../../../../constants';

export const getWidth = (state: IState): number => state.screen.width;
export const getHeight = (state: IState): number => state.screen.height;

export const getIsTaskPaneWidth: (state: IState) => boolean = createSelector(
  [getWidth],
  screenWidth => screenWidth < IS_TASK_PANE_WIDTH,
);
