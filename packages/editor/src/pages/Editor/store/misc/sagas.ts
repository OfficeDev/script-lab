import { takeEvery, put, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';
import { actions, selectors } from '../../store';
import {
  getCurrentEnv,
  editorUrls,
  environmentDisplayNames,
  currentEditorUrl,
  currentRunnerUrl,
} from 'common/lib/environment';
import ensureFreshLocalStorage from 'common/lib/utilities/ensure.fresh.local.storage';
import { localStorageKeys } from 'common/lib/constants';
import {
  showSplashScreen,
  invokeGlobalErrorHandler,
} from 'common/lib/utilities/splash.screen';
import { ScriptLabError } from 'common/lib/utilities/error';
import { openPopoutCodeEditor } from 'common/lib/utilities/popout.control';

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
  ensureFreshLocalStorage();
  const originEnvironment = window.localStorage.getItem(
    localStorageKeys.editor.originEnvironmentUrl,
  );

  const targetEnvironment = editorUrls[action.payload];

  showSplashScreen('Re-loading Script Lab...');

  // Add query string parameters to default editor URL
  if (originEnvironment) {
    window.location.href = `${originEnvironment}?targetEnvironment=${encodeURIComponent(
      targetEnvironment,
    )}`;
  } else {
    window.localStorage.setItem(
      localStorageKeys.editor.redirectEnvironmentUrl,
      targetEnvironment,
    );
    window.location.href = `${targetEnvironment}?originEnvironment=${encodeURIComponent(
      currentEditorUrl,
    )}`;
  }
}

function* onPopOutEditorSaga() {
  showSplashScreen('Navigating to the runner. Please wait...');

  openPopoutCodeEditor({
    onSuccess: () => (window.location.href = currentRunnerUrl),

    // Note: on failure will show a dialog which will displace the splash screen.
    // And which, when dismissed, will reveal the editor again.  So nothing special to do on failure.
  });
}

function* onGoToCustomFunctionsSaga() {
  window.location.href = './#/custom-functions?backButton=true';
}
