import { all } from 'redux-saga/effects'

import gistsWatcher from './gists/sagas'
import githubWatcher from './github/sagas'
import samplesWatcher from './samples/sagas'
import settingsWatcher from './settings/sagas'
import solutionsWatcher from './solutions/sagas'

export default function* rootSaga() {
  yield all([
    gistsWatcher(),
    githubWatcher(),
    samplesWatcher(),
    settingsWatcher(),
    solutionsWatcher(),
  ])
}
