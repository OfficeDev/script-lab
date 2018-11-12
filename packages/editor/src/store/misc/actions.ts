import { createAction } from 'typesafe-actions';

export const initialize = createAction('INITIALIZING');

export const switchEnvironment = createAction('SWITCH_ENVIRONMENT', resolve => {
  return (environment: string) => resolve(environment);
});
