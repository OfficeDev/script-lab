import { all } from 'redux-saga/effects'

import customFunctionsWatcher from './customFunctions/sagas'
import gistsWatcher from './gists/sagas'
import githubWatcher from './github/sagas'
import hostWatcher from './host/sagas'
import miscWatcher from './misc/sagas'
import samplesWatcher from './samples/sagas'
import settingsWatcher from './settings/sagas'
import solutionsWatcher from './solutions/sagas'

export default function* rootSaga() {
  yield all([
    customFunctionsWatcher(),
    gistsWatcher(),
    githubWatcher(),
    hostWatcher(),
    miscWatcher(),
    samplesWatcher(),
    settingsWatcher(),
    solutionsWatcher(),
  ])
}
