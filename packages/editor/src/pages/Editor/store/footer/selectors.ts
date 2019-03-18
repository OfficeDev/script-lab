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
import * as editorSelectors from '../editor/selectors';
import { selectors as hostSelectors } from 'script-lab-core/lib/modules/host';
import * as headerSelectors from '../header/selectors';
import * as settingsSelectors from '../settings/selectors';

const selectors = {
  editor: editorSelectors,
  host: hostSelectors,
  header: headerSelectors,
  settings: settingsSelectors,
};

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

const languageMap = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
};

export const getItems = createSelector(
  [selectors.header.getMode, selectors.host.getIsWeb, selectors.host.get],
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
  [
    selectors.header.getMode,
    selectors.editor.getActiveFile,
    selectors.settings.getPrettyEditorTheme,
  ],
  (
    mode: 'normal' | 'settings' | 'null-solution',
    activeFile: IFile,
    currentEditorTheme: string,
  ) => [
    {
      hidden: !languageMap[activeFile.language.toLowerCase()],
      key: 'editor-language',
      text: languageMap[activeFile.language.toLowerCase()],
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
