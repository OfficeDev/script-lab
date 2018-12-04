import React from 'react';
import { withTheme } from 'styled-components';

import {
  getCurrentEnv,
  getVisibleEnvironmentKeysToSwitchTo,
  environmentDisplayNames,
  environmentDisplayName,
} from '../../../environment';

import { PATHS } from '../../../constants';

import { HostType } from '@microsoft/office-js-helpers';

import { connect } from 'react-redux';

import { actions, selectors } from '../../../store';

import CommonFooter from 'common/lib/components/Footer';
import { Dispatch } from 'redux';
import { IRootAction } from '../../../store/actions';
import { IState as IReduxState } from '../../../store/reducer';

const languageMap = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
};

interface IPropsFromRedux {
  language: string;
  currentHost: string;
  isWeb: boolean;
  currentEditorTheme: string;
  isSettingsView: boolean;
}

const mapStateToProps = (state: IReduxState): IPropsFromRedux => ({
  language: selectors.editor.getActiveFile(state).language,
  currentHost: selectors.host.get(state),
  isWeb: selectors.host.getIsWeb(state),
  currentEditorTheme: selectors.settings.getPrettyEditorTheme(state),
  isSettingsView: selectors.settings.getIsOpen(state),
});

interface IActionsFromRedux {
  onSettingsIconClick: () => void;
  changeHost: (host: string) => void;
  cycleEditorTheme: () => void;
  switchEnvironment: (env: string) => void;
}

const mapDispatchToProps = (dispatch: Dispatch<IRootAction>): IActionsFromRedux => ({
  onSettingsIconClick: () => dispatch(actions.settings.open()),
  changeHost: (host: string) => dispatch(actions.host.change(host)),
  cycleEditorTheme: () => dispatch(actions.settings.cycleEditorTheme()),
  switchEnvironment: (env: string) => dispatch(actions.misc.switchEnvironment(env)),
});

export interface IProps extends IPropsFromRedux, IActionsFromRedux {
  theme: ITheme; // from withTheme
}

const FooterWithoutTheme = ({
  language,
  theme,
  currentHost,
  isWeb,
  onSettingsIconClick,
  changeHost,
  currentEditorTheme,
  cycleEditorTheme,
  switchEnvironment,
  isSettingsView,
}: IProps) => {
  const iconStyles = { root: { fontSize: '1.4rem' } };
  const items = [
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
            onClick: () => changeHost(v),
            itemProps: {
              styles: {
                root: {
                  background: theme.primary,
                  selectors: {
                    ':hover': {
                      background: theme.primaryDark,
                    },
                    ':active': {
                      background: theme.primaryDarker,
                    },
                  },
                },
                label: {
                  color: theme.white,
                },
              },
            },
          })),
        styles: () => ({
          root: { backgroundColor: theme.primary, color: theme.white },
        }),
      },
    },
    {
      hidden: !isSettingsView,
      key: 'environment-switcher',
      text: environmentDisplayName,
      subMenuProps: {
        items: getVisibleEnvironmentKeysToSwitchTo().map(env => ({
          key: env,
          text: environmentDisplayNames[env],
          onClick: () => switchEnvironment(env),
        })),
      },
    },
  ]
    .filter(({ hidden }) => !hidden)
    .map(item => ({ ...item, style: { fontSize: '1.2rem' } }));

  const farItems = [
    {
      hidden: !languageMap[language.toLowerCase()],
      key: 'editor-language',
      text: languageMap[language.toLowerCase()],
    },
    {
      hidden: isSettingsView,
      key: 'cycle-theme',
      iconProps: { iconName: 'Color', styles: { root: { fontSize: '1.2rem' } } },
      text: currentEditorTheme,
      ariaLabel: 'Cycle editor theme',
      onClick: cycleEditorTheme,
    },
    {
      hidden: getCurrentEnv() === 'cdn',
      key: 'report-an-issue',
      iconOnly: true,
      iconProps: { iconName: 'Emoji2', styles: iconStyles },
      href: PATHS.GITHUB_ISSUE,
      target: '_blank',
      text: 'Report an Issue',
      ariaLabel: 'Report an issue',
    },
    {
      key: 'settings',
      iconOnly: true,
      iconProps: { iconName: 'Settings', styles: iconStyles },
      text: 'Settings',
      ariaLabel: 'Settings',
      onClick: onSettingsIconClick,
    },
  ]
    .filter(({ hidden }) => !hidden)
    .map(item => ({ ...item, style: { fontSize: '1.2rem' } }));

  return <CommonFooter items={items} farItems={farItems} />;
};

export const Footer = withTheme(FooterWithoutTheme);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(Footer));
