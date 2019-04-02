import { createAction } from '../../../../utils/typesafe-telemetry-actions';

export const initialize = createAction('INITIALIZING')();

export const switchEnvironment = createAction('SWITCH_ENVIRONMENT')<string>({
  getTelemetryData: (type, payload) => ({ type, env: payload }),
});

export const confirmSwitchEnvironment = createAction('CONFIRM_SWITCH_ENVIRONMENT')<
  string
>();

export const hideLoadingSplashScreen = createAction('HIDE_LOADING_SPLASH_SCREEN')();

export const popOutEditor = createAction('POP_OUT_EDITOR')({
  getTelemetryData: type => ({ type }),
});

export const goToCustomFunctionsDashboard = createAction('GOTO_CUSTOM_FUNC_DASH')({
  getTelemetryData: type => ({ type }),
});
