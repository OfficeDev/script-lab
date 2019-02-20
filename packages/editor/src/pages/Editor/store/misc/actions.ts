import { createAction } from 'typesafe-actions';

export const initialize = createAction('INITIALIZING');

export const switchEnvironment = createAction('SWITCH_ENVIRONMENT', resolve => {
  return (environment: string) => resolve(environment);
});

export const confirmSwitchEnvironment = createAction(
  'CONFIRM_SWITCH_ENVIRONMENT',
  resolve => {
    return (environment: string) => resolve(environment);
  },
);

export const hideLoadingSplashScreen = createAction('HIDE_LOADING_SPLASH_SCREEN');

export const popOutEditor = createAction('POP_OUT_EDITOR');
export const goToCustomFunctionsDashboard = createAction('GOTO_CUSTOM_FUNC_DASH');
