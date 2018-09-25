import React from 'react'
import { withTheme } from 'styled-components'
import { getCurrentEnv } from '../../../environment'
import { PATHS } from '../../../constants'

import {
  DirectionalHint,
  ContextualMenuItemType,
} from 'office-ui-fabric-react/lib/ContextualMenu'
import { DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button'

import { HostType } from '@microsoft/office-js-helpers'

import Only from '../../Only'
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
}

const mapStateToProps = (state, ownProps: IProps): IPropsFromRedux => ({
  language: selectors.editor.getActiveFile(state).language,
  currentHost: selectors.host.get(state),
  isWeb: selectors.host.getIsWeb(state),
  hasCustomFunctions: selectors.customFunctions.getHasCustomFunctions(state),
})

interface IActionsFromRedux {
  onSettingsIconClick: () => void
  changeHost: (host: string) => void
  navigateToCustomFunctionsDashboard: () => void
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  onSettingsIconClick: () => dispatch(actions.settings.open()),
  changeHost: (host: string) => dispatch(actions.host.change(host)),
  navigateToCustomFunctionsDashboard: () =>
    dispatch(actions.customFunctions.openDashboard()),
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
}: IProps) => {
  const buttonStyles = {
    root: {
      height: '100%',
      backgroundColor: theme.primary,
      color: theme.white, // for the carrot
      selectors: {
        ':hover': {
          backgroundColor: `${theme.primaryDark} !important`,
          color: theme.white,
        },
        ':active': {
          backgroundColor: theme.primaryDark,
          color: theme.white,
        },
      },
    },
    label: {
      fontSize: '1.2rem',
      color: theme.white,
    },
    icon: {
      fontSize: '1.4rem',
      color: theme.white,
    },
  }

  return (
    <Wrapper>
      <Only when={hasCustomFunctions}>
        <DefaultButton
          primary={true}
          text="Custom Functions Dashboard"
          styles={buttonStyles}
          onClick={navigateToCustomFunctionsDashboard}
        />
      </Only>

      <Only when={isWeb}>
        <DefaultButton
          primary={true}
          text={currentHost}
          menuProps={{
            isBeakVisible: true,
            shouldFocusOnMount: true,
            items: Object.keys(HostType) // TODO(nicobell): fix the hover color
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
          }}
          styles={buttonStyles}
        />
      </Only>

      <Only when={languageMap[language.toLowerCase()]}>
        <DefaultButton
          primary={true}
          text={languageMap[language.toLowerCase()]}
          styles={buttonStyles}
        />
      </Only>

      <Only when={getCurrentEnv() !== 'production'}>
        <IconButton
          primary={true}
          iconProps={{ iconName: 'Bug' }}
          styles={buttonStyles}
          href={PATHS.GITHUB_ISSUE}
          ariaLabel="Report an issue"
        />
      </Only>

      <IconButton
        primary={true}
        ariaLabel="Settings"
        iconProps={{ iconName: 'Settings' }}
        styles={buttonStyles}
        onClick={onSettingsIconClick}
      />
    </Wrapper>
  )
}

export const Footer = withTheme(FooterWithoutTheme)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(Footer))
