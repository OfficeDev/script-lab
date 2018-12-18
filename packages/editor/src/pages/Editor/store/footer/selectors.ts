import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { MessageBarType } from 'office-ui-fabric-react/lib/components/MessageBar';
import { IState } from '../reducer';

import { HostType } from '@microsoft/office-js-helpers';
import {
  NULL_SOLUTION_ID,
  SETTINGS_SOLUTION_ID,
  IS_TASK_PANE_WIDTH,
  PATHS,
} from '../../../../constants';
import {
  getCurrentEnv,
  getVisibleEnvironmentKeysToSwitchTo,
  environmentDisplayNames,
  environmentDisplayName,
} from 'common/lib/environment';

// selectors
import { createSelector } from 'reselect';
import {
  getActiveSolution,
  getIsActiveSolutionCF,
  getIsActiveSolutionTrusted,
  getActiveFile,
} from '../editor/selectors';
import { getToken, getIsLoggingInOrOut } from '../github/selectors';
import { getIsTaskPane } from '../screen/selectors';
import { getIsRunnableOnThisHost, getIsWeb, get as getHost } from '../host/selectors';
import { getMode, IHeaderItem } from '../header/selectors';
import { getPrettyEditorTheme } from '../settings/selectors';

// actions
import * as dialog from '../dialog/actions';
import * as editor from '../editor/actions';
import * as gists from '../gists/actions';
import * as github from '../github/actions';
import * as host from '../host/actions';
import * as misc from '../misc/actions';
import * as messageBar from '../messageBar/actions';
import * as solutions from '../solutions/actions';
import * as settings from '../settings/actions';

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
  [getMode, getIsWeb, getHost],
  (
    mode: 'normal' | 'settings' | 'null-solution',
    isWeb: boolean,
    currentHost: string,
  ) => {
    return [
      {
        hidden: !isWeb,
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
              // onClick: () => changeHost(v),
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
            // onClick: () => switchEnvironment(env),
          })),
        },
      },
    ];
  },
);

export const getFarItems = createSelector(
  [getMode, getActiveFile, getPrettyEditorTheme],
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
