import { all, select } from 'redux-saga/effects';

import dialogWatcher from './dialog/sagas';
import editorWatcher from './editor/sagas';
import gistsWatcher from './gists/sagas';
import githubWatcher from './github/sagas';
import hostWatcher from './host/sagas';
import miscWatcher from './misc/sagas';
import samplesWatcher from './samples/sagas';
import settingsWatcher from './settings/sagas';
import solutionsWatcher from './solutions/sagas';

export default function* rootSaga() {
  yield all([
    dialogWatcher(),
    editorWatcher(),
    gistsWatcher(),
    githubWatcher(),
    hostWatcher(),
    miscWatcher(),
    samplesWatcher(),
    settingsWatcher(),
    solutionsWatcher(),
  ]);
}
