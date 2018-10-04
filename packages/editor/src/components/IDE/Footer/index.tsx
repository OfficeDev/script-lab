import React from 'react'
import { withTheme } from 'styled-components'

import { Customizer } from 'office-ui-fabric-react/lib/Utilities'
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'
import { ITheme as IFabricTheme } from 'office-ui-fabric-react/lib/Styling'

import { getCurrentEnv } from '../../../environment'
import { PATHS } from '../../../constants'

import {
  DirectionalHint,
  ContextualMenuItemType,
} from 'office-ui-fabric-react/lib/ContextualMenu'
import { getCommandBarFabricTheme } from '../../../theme'

import { HostType } from '@microsoft/office-js-helpers'

import { Wrapper } from './styles'

import { connect } from 'react-redux'
import selectors from '../../../store/selectors'
import actions from '../../../store/actions'

const languageMap = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
}

interface IPropsFromRedux {
  language: string
  currentHost: string
  isWeb: boolean
  hasCustomFunctions: boolean
  commandBarFabricTheme: IFabricTheme
  currentEditorTheme: string
}

const mapStateToProps = (state, ownProps: IProps): IPropsFromRedux => ({
  language: selectors.editor.getActiveFile(state).language,
  currentHost: selectors.host.get(state),
  isWeb: selectors.host.getIsWeb(state),
  hasCustomFunctions: selectors.customFunctions.getHasCustomFunctions(state),
  commandBarFabricTheme: getCommandBarFabricTheme(selectors.host.get(state)),
  currentEditorTheme: selectors.settings.getPrettyEditorTheme(state),
})

interface IActionsFromRedux {
  onSettingsIconClick: () => void
  changeHost: (host: string) => void
  navigateToCustomFunctionsDashboard: () => void
  cycleEditorTheme: () => void
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  onSettingsIconClick: () => dispatch(actions.settings.open()),
  changeHost: (host: string) => dispatch(actions.host.change(host)),
  navigateToCustomFunctionsDashboard: () =>
    dispatch(actions.customFunctions.openDashboard()),
  cycleEditorTheme: () => dispatch(actions.settings.cycleEditorTheme()),
})

export interface IProps extends IPropsFromRedux, IActionsFromRedux {
  theme: ITheme // from withTheme
}

const FooterWithoutTheme = ({
  language,
  theme,
  currentHost,
  isWeb,
  hasCustomFunctions,
  onSettingsIconClick,
  navigateToCustomFunctionsDashboard,
  changeHost,
  commandBarFabricTheme,
  currentEditorTheme,
  cycleEditorTheme,
}: IProps) => {
  const iconStyles = { root: { fontSize: '1.4rem' } }
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
        styles: props => ({
          root: { backgroundColor: theme.primary, color: theme.white },
        }),
      },
    },
    {
      hidden: !hasCustomFunctions,
      key: 'custom-functions-dashboard',
      text: 'Custom Functions Dashboard',
      onClick: navigateToCustomFunctionsDashboard,
    },
  ]
    .filter(({ hidden }) => !hidden)
    .map(item => ({ ...item, style: { fontSize: '1.2rem' } }))

  const farItems = [
    {
      hidden: !languageMap[language.toLowerCase()],
      key: 'editor-language',
      text: languageMap[language.toLowerCase()],
    },
    {
      key: 'cycle-theme',
      iconProps: { iconName: 'Color', styles: { root: { fontSize: '1.2rem' } } },
      text: currentEditorTheme,
      ariaLabel: 'Cycle editor theme',
      onClick: cycleEditorTheme,
    },
    {
      hidden: getCurrentEnv() === 'prod',
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
    .map(item => ({ ...item, style: { fontSize: '1.2rem' } }))

  return (
    <Customizer settings={{ theme: commandBarFabricTheme }}>
      <Wrapper>
        <CommandBar
          items={items}
          farItems={farItems}
          styles={{
            root: {
              paddingLeft: 0,
              paddingRight: 0,
              height: '2rem',
            },
          }}
          ariaLabel={'Use left and right arrow keys to navigate between commands'}
        />
      </Wrapper>
    </Customizer>
  )
}

export const Footer = withTheme(FooterWithoutTheme)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(Footer))
