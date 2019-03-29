import { createAction } from '../../../../utils/typesafe-telemetry-actions';

export const initialize = createAction('INITIALIZING')();

export const switchEnvironment = createAction('SWITCH_ENVIRONMENT')<string>({
  shouldSendTelemetry: true,
});

export const confirmSwitchEnvironment = createAction('CONFIRM_SWITCH_ENVIRONMENT')<
  string
>();

export const hideLoadingSplashScreen = createAction('HIDE_LOADING_SPLASH_SCREEN')();

export const popOutEditor = createAction('POP_OUT_EDITOR')({ shouldSendTelemetry: true });

export const goToCustomFunctionsDashboard = createAction('GOTO_CUSTOM_FUNC_DASH')({
  shouldSendTelemetry: true,
});
