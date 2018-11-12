import { createAction } from 'typesafe-actions';

export const updateSize = createAction('SCREEN_UPDATE_SIZE', resolve => {
  return (props: { width: number; height: number }) => resolve(props);
});
