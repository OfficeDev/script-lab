import { takeEvery, put, call, select } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import { actions, selectors } from '../'
import { getCurrentEnv, editorUrls } from '../../environment'

export default function* miscWatcher() {
  yield takeEvery(getType(actions.misc.initialize), onInitializeSaga)
  yield takeEvery(getType(actions.misc.switchEnvironment), onSwitchEnvironmentSaga)
}

function* onInitializeSaga() {
  const currentHost = yield select(selectors.host.get)
  yield put(actions.host.change(currentHost))
}

function* onSwitchEnvironmentSaga(
  action: ActionType<typeof actions.misc.switchEnvironment>,
) {
  const newEnvironment = action.payload
  const currentEnvironment = getCurrentEnv()

  if (newEnvironment !== currentEnvironment) {
    window.location.href = `${
      editorUrls.production
    }?targetEnvironment=${encodeURIComponent(editorUrls[newEnvironment])}`
  }
}
