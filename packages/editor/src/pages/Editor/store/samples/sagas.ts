import { put, takeEvery, call, select } from 'redux-saga/effects';
import { getType, ActionType } from 'typesafe-actions';

import selectors from '../selectors';
import { samples } from '../actions';
import { fetchYaml } from '../../services/general';
import { convertSnippetToSolution } from '../../../../utils';
import { createSolutionSaga } from '../solutions/sagas';
import { currentOfficeJsRawSnippetsBaseRepoUrl } from 'common/lib/environment';
import { sendTelemetryEvent } from 'common/lib/utilities/telemetry';

function* fetchAllSamplesMetadataSaga() {
  const host: string = yield select(selectors.host.get);
  const { content, error } = yield call(
    fetchYaml,
    `${currentOfficeJsRawSnippetsBaseRepoUrl}/playlists/${host.toLowerCase()}.yaml`,
  );
  if (content) {
    yield put(
      samples.fetchMetadata.success(content.map(sample => ({ ...sample, host }))),
    );
  } else {
    yield put(samples.fetchMetadata.failure(error));
  }
}

function* openSampleSaga(action: ActionType<typeof samples.get.request>) {
  const url = action.payload.rawUrl;

  const { content, error } = yield call(fetchYaml, url);
  if (content) {
    const solution = convertSnippetToSolution(content);
    sendTelemetryEvent('Editor.SampleLoaded', [
      oteljs.makeStringDataField('SampleName', solution.name),
      oteljs.makeStringDataField('SampleID', solution.id),
    ]);
    yield put(samples.get.success({ solution }));
  } else {
    yield put(samples.get.failure(error));
  }
}

function* handleOpenSampleSuccessSaga(action: ActionType<typeof samples.get.success>) {
  yield call(createSolutionSaga, action.payload.solution);
}

export default function* samplesWatcher() {
  yield takeEvery(getType(samples.fetchMetadata.request), fetchAllSamplesMetadataSaga);

  yield takeEvery(getType(samples.get.request), openSampleSaga);
  yield takeEvery(getType(samples.get.success), handleOpenSampleSuccessSaga);
}
