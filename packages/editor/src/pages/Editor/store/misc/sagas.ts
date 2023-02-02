import { takeEvery, put, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import { actions, selectors } from '../../store';
import {
  getCurrentEnv,
  environmentDisplayNames,
  currentRunnerUrl,
  currentEditorUrl,
} from 'common/lib/environment';
import { showSplashScreen } from 'common/lib/utilities/splash.screen';
import { openPopoutCodeEditor } from 'common/lib/utilities/popout.control';
import { redirectEditorToOtherEnvironment } from 'common/lib/utilities/environment.redirector';

export default function* miscWatcher() {
  yield takeEvery(getType(actions.misc.initialize), onInitializeSaga);
  yield takeEvery(getType(actions.misc.switchEnvironment), onSwitchEnvironmentSaga);
  yield takeEvery(
    getType(actions.misc.confirmSwitchEnvironment),
    onConfirmSwitchEnvironmentSaga,
  );
  yield takeEvery(getType(actions.misc.popOutEditor), onPopOutEditorSaga);
  yield takeEvery(
    getType(actions.misc.goToCustomFunctionsDashboard),
    onGoToCustomFunctionsSaga,
  );
}

function* onInitializeSaga() {
  const currentHost = yield select(selectors.host.get);
  yield put(actions.host.change(currentHost));
}

function* onSwitchEnvironmentSaga(
  action: ActionType<typeof actions.misc.switchEnvironment>,
) {
  const newEnvironment = action.payload;
  const currentEnvironment = getCurrentEnv();

  if (newEnvironment !== currentEnvironment) {
    const currentEnvPretty = environmentDisplayNames[currentEnvironment];
    const newEnvPretty = environmentDisplayNames[newEnvironment];
    const title = `Switch from ${currentEnvPretty} to ${newEnvPretty}?`;
    const subText =
      'You are about to change your Script Lab environment and will not have access ' +
      'to your saved local snippets until you return to this environment. ' +
      'Are you sure you want to proceed?';

    const buttons = [
      {
        key: 'ok-button',
        text: 'OK',
        isPrimary: true,
        action: actions.misc.confirmSwitchEnvironment(newEnvironment),
      },
      {
        key: 'cancel-button',
        text: 'Cancel',
        isPrimary: false,
        action: actions.dialog.hide(),
      },
    ];

    yield put(actions.dialog.show({ title, subText, buttons, isBlocking: true }));
  }
}

function* onConfirmSwitchEnvironmentSaga(
  action: ActionType<typeof actions.misc.confirmSwitchEnvironment>,
) {
  const configName = action.payload;
  yield redirectEditorToOtherEnvironment(configName);
}

function* onPopOutEditorSaga() {
  yield showSplashScreen('Navigating to the runner. Please wait...');

  openPopoutCodeEditor({
    onSuccess: () => (window.location.href = currentRunnerUrl),

    // Note: on failure will show a dialog which will displace the splash screen.
    // And which, when dismissed, will reveal the editor again.  So nothing special to do on failure.
  });
}

function* onGoToCustomFunctionsSaga() {
  // Redirect to the custom functions dashboard via an indirect route, first loading a different
  //   html page that will redirect back to the actual CF dashboard route.
  // The reason can't go directly is that if only do a hash-level navigation,
  //   will end up loading Office.js twice (which throws an error).
  // And can't do a href-setting followed by a reload because on the Edge browser,
  //   it seems to cause the outer Office Online window to get redirected
  //   to the editor page (bug https://github.com/OfficeDev/script-lab/issues/691).
  yield (window.location.href =
    currentEditorUrl + '/custom-functions-with-back-button.html');
}
