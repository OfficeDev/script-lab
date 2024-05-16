import { put, takeEvery, select } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import YAML from "js-yaml";

import {
  settings as settingsActions,
  solutions as solutionsActions,
  editor as editorActions,
} from "../actions";

import selectors from "../selectors";

import isEqual from "lodash/isEqual";

import { allowedSettings, defaultSettings, invisibleDefaultSettings } from "./utilities";

import {
  SETTINGS_SOLUTION_ID,
  USER_SETTINGS_FILE_ID,
  DEFAULT_SETTINGS_FILE_ID,
} from "../../../../constants";

export default function* settingsWatcher() {
  yield takeEvery(getType(settingsActions.editFile), editSettingsCheckSaga);
  yield takeEvery(getType(settingsActions.open), openSettingsSaga);
  yield takeEvery(getType(settingsActions.close), closeSettingsSaga);
  yield takeEvery(getType(settingsActions.cycleEditorTheme), cycleEditorThemeSaga);
}

export const verifySettings = (parsed): Partial<ISettings> => {
  const validKeys = [...Object.keys(defaultSettings), ...Object.keys(invisibleDefaultSettings)];
  const parsedKeys = Object.keys(parsed);
  const allowedValueKeys = Object.keys(allowedSettings);

  const invalidKeys = parsedKeys.filter((key) => !validKeys.includes(key));
  if (invalidKeys.length > 0) {
    throw new Error(`Unrecognized keys: ${invalidKeys.join(", ")}`);
  }

  const newSettings = {};

  Object.keys(parsed).forEach((setting) => {
    if (allowedValueKeys.includes(setting) && !allowedSettings[setting].includes(parsed[setting])) {
      /* In this case, there was a setting in parsed that wasn't in the list of allowed */
      throw new Error(
        `'${parsed[setting]}' is not an allowed value for '${setting}'. ` +
          `Allowed values include: ${allowedSettings[setting]
            .map((item: string) => `"${item}"`)
            .join(", ")}.`,
      );
    } else {
      newSettings[setting] = parsed[setting];
    }
  });

  return newSettings;
};

function* editSettingsCheckSaga(action: ActionType<typeof settingsActions.editFile>) {
  try {
    // First off, check whether the new settings are actually empty.
    // If they are, do special processing, since you can't safeLoad from an empty string.
    const isEmpty = action.payload.newSettings.trim() === "";
    const newSettings = isEmpty ? {} : verifySettings(YAML.load(action.payload.newSettings));
    const tabSize = { ...defaultSettings, ...newSettings }["editor.tabSize"];

    const currentUserSettingsFile: IFile = yield select(
      selectors.solutions.getFile,
      USER_SETTINGS_FILE_ID,
    );

    // safeDump of an empty object gives you the JSON object `{}`, whereas what we want
    //    in this case is just an empty string. So make it so:
    currentUserSettingsFile.content = isEmpty ? "" : YAML.dump(newSettings, { indent: tabSize });
    yield put(settingsActions.edit.success({ userSettings: newSettings }));
    yield put(
      solutionsActions.edit({
        id: SETTINGS_SOLUTION_ID,
        fileId: USER_SETTINGS_FILE_ID,
        file: currentUserSettingsFile,
      }),
    );
  } catch (e) {
    yield put(settingsActions.edit.failure(e));
  }
}

function* openSettingsSaga(action: ActionType<typeof settingsActions.open>) {
  const { editor } = yield select();
  const { active } = editor;
  const { solutionId, fileId } = active;

  if (solutionId !== SETTINGS_SOLUTION_ID) {
    yield put(settingsActions.setLastActive({ solutionId, fileId }));

    const userSettings = yield select(selectors.settings.getUser);
    const fileIdToOpen = isEqual(userSettings, {})
      ? DEFAULT_SETTINGS_FILE_ID
      : USER_SETTINGS_FILE_ID;

    yield put(
      editorActions.openFile({
        solutionId: SETTINGS_SOLUTION_ID,
        fileId: fileIdToOpen,
      }),
    );
  }
}

function* closeSettingsSaga(action: ActionType<typeof settingsActions.close>) {
  const { settings } = yield select();
  const { lastActive } = settings;
  const { solutionId, fileId } = lastActive;
  yield put(editorActions.openFile({ solutionId, fileId }));
}

function* cycleEditorThemeSaga() {
  const settings = yield select(selectors.settings.get);
  const themes = allowedSettings["editor.theme"];

  const currentTheme = settings["editor.theme"];
  const currentThemeIndex = themes.indexOf(currentTheme);
  const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
  const nextTheme = themes[nextThemeIndex];

  const currentUserSettings = yield select(selectors.settings.getUser);
  const newUserSettings = { ...currentUserSettings, "editor.theme": nextTheme };

  const tabSize = settings["editor.tabSize"];

  yield put(
    settingsActions.editFile({
      newSettings: JSON.stringify(newUserSettings, null, tabSize),
    }),
  );
}
