import { HostType } from '@microsoft/office-js-helpers';
import { PATHS } from '../../../../constants';
import {
  getCurrentEnv,
  getVisibleEnvironmentKeysToSwitchTo,
  environmentDisplayNames,
  environmentDisplayName,
} from 'common/lib/environment';

// selectors
import { createSelector } from 'reselect';
import { getActiveFile, getActiveSolution } from '../editor/selectors';
import { getIsWeb, get as getHost } from '../host/selectors';
import { getMode } from '../header/selectors';
import { getPrettyEditorTheme } from '../settings/selectors';

// actions
import {
  dialog,
  editor,
  gists,
  github,
  host,
  messageBar,
  misc,
  solutions,
  settings,
} from '../actions';
import { getPythonConfigIfAny } from '../../../../utils/python';
import { SCRIPT_FILE_NAME } from 'common/lib/utilities/solution';
import { languageMapLowercased, languageMapDisplayNames } from 'common/lib/languageMap';

const actions = {
  dialog,
  editor,
  gists,
  github,
  host,
  messageBar,
  misc,
  solutions,
  settings,
};

export const getItems = createSelector(
  [getMode, getIsWeb, getHost],
  (
    mode: 'normal' | 'settings' | 'null-solution',
    isWeb: boolean,
    currentHost: string,
  ) => {
    return [
      {
        hidden: !isWeb,
        'data-testid': 'host-selector',
        key: 'host-selector',
        text: currentHost,
        subMenuProps: {
          isBeakVisible: true,
          shouldFocusOnMount: true,
          items: Object.keys(HostType)
            .map(k => HostType[k])
            .filter(v => v !== currentHost)
            .map(v => ({
              key: v,
              text: v,
              actionCreator: () => actions.host.change(v),
            })),
        },
      },
      {
        hidden: mode !== 'settings',
        key: 'environment-switcher',
        text: environmentDisplayName,
        subMenuProps: {
          items: getVisibleEnvironmentKeysToSwitchTo().map(env => ({
            key: env,
            text: environmentDisplayNames[env],
            actionCreator: () => actions.misc.switchEnvironment(env),
          })),
        },
      },
    ];
  },
);

export const getFarItems = createSelector(
  [getMode, getActiveSolution, getActiveFile, getPrettyEditorTheme],
  (
    mode: 'normal' | 'settings' | 'null-solution',
    activeSolution: ISolution,
    activeFile: IFile,
    currentEditorTheme: string,
  ) => [
    {
      hidden: !languageMapLowercased[activeFile.language],
      key: 'editor-language',
      text: languageMapDisplayNames[activeFile.language],
      subMenuProps:
        activeFile.name === SCRIPT_FILE_NAME && getPythonConfigIfAny()
          ? {
              isBeakVisible: true,
              items: [languageMapLowercased.typescript, languageMapLowercased.python].map(
                language => ({
                  key: language,
                  text: languageMapDisplayNames[language],
                  actionCreator: () =>
                    actions.solutions.changeLanguage({
                      solutionId: activeSolution.id,
                      fileId: activeFile.id,
                      language: language,
                    }),
                }),
              ),
            }
          : null,
    },
    {
      hidden: mode === 'settings',
      key: 'cycle-theme',
      iconProps: { iconName: 'Color', styles: { root: { fontSize: '1.2rem' } } },
      text: currentEditorTheme,
      ariaLabel: 'Cycle editor theme',
      actionCreator: actions.settings.cycleEditorTheme,
    },
    {
      hidden: getCurrentEnv() === 'cdn',
      key: 'report-an-issue',
      iconOnly: true,
      iconProps: { iconName: 'Emoji2' },
      href: PATHS.GITHUB_ISSUE,
      target: '_blank',
      text: 'Report an Issue',
      ariaLabel: 'Report an issue',
    },
    {
      key: 'settings',
      iconOnly: true,
      iconProps: { iconName: 'Settings' },
      text: 'Settings',
      ariaLabel: 'Settings',
      actionCreator: actions.settings.open,
    },
  ],
);
