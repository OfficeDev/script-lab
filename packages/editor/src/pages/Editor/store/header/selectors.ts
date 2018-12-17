import { ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { IState } from '../reducer';
import { getActiveSolution } from '../editor/selectors';
import { createSelector } from 'reselect';
import {
  NULL_SOLUTION_ID,
  SETTINGS_SOLUTION_ID,
  IS_TASK_PANE_WIDTH,
} from '../../../../constants';
import { getToken, getIsLoggingInOrOut } from '../github/selectors';
import { getWidth } from '../screen/selectors';

import * as dialog from '../dialog/actions';
import * as editor from '../editor/actions';
import * as gists from '../gists/actions';
import * as github from '../github/actions';
import * as solutions from '../solutions/actions';
import * as settings from '../settings/actions';

const actions = { dialog, editor, gists, github, solutions, settings };

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

export const getIsLoggedIn: (state: IState) => boolean = createSelector(
  [getToken],
  token => !!token,
);

export const getShouldHideTitle: (state: IState) => boolean = createSelector(
  [getWidth],
  screenWidth => screenWidth < IS_TASK_PANE_WIDTH,
);

const showLoginToGithubDialog = actions.dialog.show({
  title: 'Please sign in to GitHub',
  subText: 'In order to use the gist functionality, you must first sign in to GitHub.',
  buttons: [
    {
      text: 'Sign in',
      action: actions.github.login.request(),
      isPrimary: true,
    },
    {
      text: 'Cancel',
      action: dialog.dismiss(),
      isPrimary: false,
    },
  ],
});

export const getItems /*: (state: IState) => IHeaderItem[] */ = createSelector(
  [getMode, getActiveSolution, getShouldHideTitle, getIsLoggedIn],
  (mode, activeSolution, shouldHideTitle, isLoggedIn) => {
    const titleStyles = {
      style: { paddingRight: shouldHideTitle ? '0' : '3rem' },
      iconProps: shouldHideTitle ? { iconName: 'OfficeAddinsLogo' } : {},
      iconOnly: shouldHideTitle,
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
            actionCreator: () => {
              // actions.dialog.show();
              /*  TODO: OPEN SOLUTION SETTINGS */
            },
            ...titleStyles,
          },
          {
            key: 'delete',
            text: 'Delete',
            iconProps: { iconName: 'Delete' },
            actionCreator: () =>
              actions.dialog.show({
                title: 'Delete Snippet?',
                subText: `Are you sure you want to delete '${activeSolution.name}'?`,
                buttons: [
                  {
                    isPrimary: true,
                    text: 'Yes',
                    action: actions.solutions.remove(activeSolution),
                  },
                  {
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

export const getFarItems /* (state: IState) => IHeaderItem[] */ = createSelector(
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
                      actionCreator: actions.github.logout,
                    },
                  ],
                }
              : undefined,
            iconOnly: true,
            actionCreator: isLoggingInOrOut ? () => {} : actions.github.login.request,
          },
        ];
      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
  },
);
