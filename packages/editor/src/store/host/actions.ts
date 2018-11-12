import { createAction } from 'typesafe-actions';

export const change = createAction('HOST_CHANGE', resolve => {
  return (host: string) => resolve(host);
});
