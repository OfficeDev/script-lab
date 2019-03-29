import { createAction } from '../../../../utils/typesafe-telemetry-actions';

export const updateSize = createAction('SCREEN_UPDATE_SIZE')<{
  width: number;
  height: number;
}>();
