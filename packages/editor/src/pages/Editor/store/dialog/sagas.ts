import { put, takeEvery } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { pause } from 'common/lib/utilities/misc';

import { dialog } from '../actions';

export default function* dialogWatcher() {
  yield takeEvery(getType(dialog.dismiss), onDialogDismissSaga);
}

function* onDialogDismissSaga() {
  // This is to play nicely with the dialog disappearing animation
  // To play nicely, it sets the visible to false, which sets the React component to hide itself
  yield put(dialog.hide());
  // it waits half a second
  yield pause(500);
  // then resets all the properties on the dialog
  yield put(dialog.reset());
  // this prevents the dialog from appearing blank for a split second
}
