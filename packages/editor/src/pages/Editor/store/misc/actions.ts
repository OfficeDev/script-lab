import { createAction } from 'typesafe-actions';

export const initialize = createAction('INITIALIZING');

export const switchEnvironment = createAction('SWITCH_ENVIRONMENT', resolve => {
  return (environment: string) =>
    resolve(environment, { telemetry: { eventName: 'Editor.EnvironmentSwitched' } });
});

export const confirmSwitchEnvironment = createAction(
  'CONFIRM_SWITCH_ENVIRONMENT',
  resolve => {
    return (environment: string) => resolve(environment);
  },
);

export const hideLoadingSplashScreen = createAction('HIDE_LOADING_SPLASH_SCREEN');

export const popOutEditor = createAction('POP_OUT_EDITOR', resolve => {
  return () => resolve(null, { telemetry: { eventName: 'Editor.PoppedOut' } });
});

export const goToCustomFunctionsDashboard = createAction(
  'GOTO_CUSTOM_FUNC_DASH',
  resolve => {
    return () =>
      resolve(null, { telemetry: { eventName: 'Editor.CustomFunctionsDashboard' } });
  },
);
