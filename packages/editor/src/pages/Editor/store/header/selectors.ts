import queryString from 'query-string';
import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { MessageBarType } from 'office-ui-fabric-react/lib/components/MessageBar';
import { IState } from '../reducer';

import { NULL_SOLUTION_ID, SETTINGS_SOLUTION_ID } from '../../../../constants';

// selectors
import { createSelector } from 'reselect';
import {
  getActiveSolution,
  getIsActiveSolutionCF,
  getIsActiveSolutionTrusted,
} from '../editor/selectors';
import { getIsLoggingInOrOut, getIsLoggedIn } from '../github/selectors';
import { getIsTaskPaneWidth } from '../screen/selectors';
import { getIsRunnableOnThisHost } from '../host/selectors';
import { shouldShowPopoutControl } from 'common/lib/utilities/popout.control';

// actions
import {
  dialog,
  editor,
  gists,
  github,
  messageBar,
  misc,
  solutions,
  settings,
} from '../actions';

const actions = { dialog, editor, gists, github, messageBar, misc, solutions, settings };

export interface IHeaderItem extends ICommandBarItemProps {
  actionCreator?: () => { type: string; payload?: any };
}

export const getMode: (
  state: IState,
) => 'normal' | 'settings' | 'null-solution' = createSelector(
  [getActiveSolution],
  activeSolution => {
    switch (activeSolution.id) {
      case NULL_SOLUTION_ID:
        return 'null-solution';
      case SETTINGS_SOLUTION_ID:
        return 'settings';
      default:
        return 'normal';
    }
  },
);

const shouldSplitRunButtonSessionStorageKey = 'should_split_run_button';

const queryParams: { commands: number } = queryString.parse(window.location.search);

// If the URL has "commands=1" on it (from the URL specified in the manifest),
//     it means that it's run in an Office host that supports ribbon commands.
//     For such hosts, we want to split out the "run" button to alert them that
//     a better experience is to run in side-by-side mode.
if (queryParams.commands) {
  sessionStorage[shouldSplitRunButtonSessionStorageKey] = true;
}

const getShouldSplitRunButton = () =>
  !!sessionStorage.getItem(shouldSplitRunButtonSessionStorageKey);

const getRunButton = createSelector(
  [
    getActiveSolution,
    getIsRunnableOnThisHost,
    getIsActiveSolutionCF,
    getIsActiveSolutionTrusted,
  ],
  (
    solution: ISolution,
    isRunnableOnThisHost: boolean,
    isCustomFunctionsView: boolean,
    isTrusted: boolean,
  ) => {
    const youMustTrustBeforeRunMessageBarAction = actions.messageBar.show({
      style: MessageBarType.error,
      text: 'You must trust the snippet before you can run it.',
      button: {
        text: 'Trust',
        action: actions.solutions.updateOptions({
          solution,
          options: { isUntrusted: false },
        }),
      },
    });

    // NOTE: wrapping each item inside of an array so that it can be ... by the consumer getItems
    if (!isRunnableOnThisHost) {
      return [];
    } else if (isCustomFunctionsView) {
      return [
        {
          key: 'register-cf',
          text: 'Register',
          iconProps: { iconName: 'Play' },
          actionCreator: actions.misc.goToCustomFunctionsDashboard,
        },
      ];
    } else {
      return [
        {
          key: 'run',
          text: 'Run',
          iconProps: { iconName: 'Play' },
          ...(getShouldSplitRunButton()
            ? {
                // is in add-in
                subMenuProps: {
                  items: [
                    {
                      key: 'run-in-this-pane',
                      text: 'Run in this pane',
                      iconProps: { iconName: 'Play' },
                      actionCreator: isTrusted
                        ? actions.editor.navigateToRun
                        : () => youMustTrustBeforeRunMessageBarAction,
                    },
                    {
                      key: 'run-side-by-side',
                      text: 'Run side-by-side',
                      iconProps: { iconName: 'OpenPaneMirrored' },
                      actionCreator: isTrusted
                        ? () =>
                            actions.dialog.show({
                              title: 'Run side-by-side with editor',
                              subText: `To run the snippet side-by-side with the editor, choose "Run" in the Ribbon.
  Running side-by-side offers both a quicker refresh, and the added advantage of keeping your position and undo-history in the editor.`,
                              buttons: [
                                {
                                  key: 'got-it-button',
                                  text: 'Got it',
                                  isPrimary: true,
                                  action: actions.dialog.dismiss(),
                                },
                              ],
                            })
                        : () => youMustTrustBeforeRunMessageBarAction,
                    },
                  ],
                },
              }
            : {
                // not in add-in
                actionCreator: isTrusted
                  ? actions.editor.navigateToRun
                  : () => youMustTrustBeforeRunMessageBarAction,
              }),
        },
      ];
    }
  },
);

const showLoginToGithubDialog = actions.dialog.show({
  title: 'Please sign in to GitHub',
  subText: 'In order to use the gist functionality, you must first sign in to GitHub.',
  buttons: [
    {
      key: 'sign-in',
      text: 'Sign in',
      action: actions.github.login.request(),
      isPrimary: true,
    },
    {
      key: 'cancel',
      text: 'Cancel',
      action: dialog.dismiss(),
      isPrimary: false,
    },
  ],
});

export const getItems = createSelector(
  [getMode, getActiveSolution, getIsTaskPaneWidth, getIsLoggedIn, getRunButton],
  (mode, activeSolution, iconOnly, isLoggedIn, runButton) => {
    const titleStyles = {
      style: { paddingRight: iconOnly ? '0' : '3rem' },
      iconProps: iconOnly ? { iconName: 'OfficeAddinsLogo' } : {},
      iconOnly,
    };

    switch (mode) {
      case 'null-solution':
        return [];
      case 'settings':
        return [
          {
            key: 'back',
            ariaLabel: 'Back',
            iconOnly: true,
            iconProps: { iconName: 'Back' },
            actionCreator: actions.settings.close,
          },
          {
            key: 'settings-title',
            text: activeSolution.name,
            ...titleStyles,
          },
        ];
      case 'normal':
        const solutionId = activeSolution.id;
        return [
          {
            key: 'nav',
            ariaLabel: 'Backstage',
            iconOnly: true,
            iconProps: { iconName: 'GlobalNavButton' },
            actionCreator: actions.editor.openBackstage,
          },
          {
            key: 'solution-name',
            text: activeSolution.name,
            ...titleStyles,
          },
          ...runButton,
          {
            key: 'delete',
            text: 'Delete',
            iconProps: { iconName: 'Delete' },
            iconOnly,
            actionCreator: () =>
              actions.dialog.show({
                title: 'Delete Snippet?',
                subText: `Are you sure you want to delete '${activeSolution.name}'?`,
                buttons: [
                  {
                    key: 'yes-button',
                    isPrimary: true,
                    text: 'Yes',
                    action: actions.solutions.remove(activeSolution),
                  },
                  {
                    key: 'no-button',
                    isPrimary: false,
                    text: 'No',
                    action: actions.dialog.dismiss(),
                  },
                ],
              }),
          },
          {
            key: 'share',
            text: 'Share',
            iconProps: { iconName: 'Share' },
            iconOnly,
            subMenuProps: {
              items: [
                {
                  hidden: !(
                    activeSolution.source &&
                    activeSolution.source.origin === 'gist' &&
                    isLoggedIn
                  ),
                  key: 'update-gist',
                  text: 'Update existing gist',
                  iconProps: { iconName: 'Save' },
                  actionCreator: () => actions.gists.update.request({ solutionId }),
                },
                {
                  key: 'new-public-gist',
                  text: 'New public gist',
                  iconProps: { iconName: 'PageCheckedIn' },
                  actionCreator: isLoggedIn
                    ? () => actions.gists.create.request({ solutionId, isPublic: true })
                    : () => showLoginToGithubDialog,
                },
                {
                  key: 'new-secret-gist',
                  text: 'New secret gist',
                  iconProps: { iconName: 'ProtectedDocument' },
                  actionCreator: isLoggedIn
                    ? () => actions.gists.create.request({ solutionId, isPublic: false })
                    : () => showLoginToGithubDialog,
                },
                {
                  key: 'export-to-clipboard',
                  text: 'Copy to clipboard',
                  iconProps: { iconName: 'ClipboardSolid' },
                  className: 'export-to-clipboard',
                },
              ]
                .filter(option => !option.hidden)
                .map(option => {
                  const { hidden, ...rest } = option;
                  return rest;
                }),
            },
          },
        ];
      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
  },
);

export const getFarItems = createSelector(
  [getMode, getIsLoggedIn, getIsLoggingInOrOut],
  (mode, isLoggedIn, isLoggingInOrOut) => {
    switch (mode) {
      case 'null-solution':
      case 'settings':
        return [];
      case 'normal':
        return [
          {
            key: 'account',
            ariaLabel: isLoggedIn ? 'Logout' : 'Login',
            subMenuProps: isLoggedIn
              ? {
                  items: [
                    {
                      key: 'logout',
                      text: 'Logout',
                      actionCreator: actions.github.logout.request,
                    },
                  ],
                }
              : undefined,
            iconOnly: true,
          },
          shouldShowPopoutControl('editor')
            ? {
                key: 'pop-out',
                ariaLabel: 'Pop out editor',
                iconOnly: true,
                iconProps: { iconName: 'OpenInNewWindow' },
                actionCreator: actions.misc.popOutEditor,
              }
            : null,
        ].filter(item => item != null);
      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
  },
);
