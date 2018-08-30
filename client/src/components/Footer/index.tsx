import React from 'react'
import { withTheme } from 'styled-components'

import {
  DirectionalHint,
  ContextualMenuItemType,
} from 'office-ui-fabric-react/lib/ContextualMenu'
import { DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button'
import { Customizer } from 'office-ui-fabric-react/lib/Utilities'
import { createTheme } from 'office-ui-fabric-react/lib/Styling'

import { HostType } from '@microsoft/office-js-helpers'

import Only from '../Only'
import { Wrapper } from './styles'
import BarButton from '../BarButton'
import FabricIcon from '../FabricIcon'

import { connect } from 'react-redux'
import selectors from '../../store/selectors'
import { host as hostActions, editor as editorActions } from '../../store/actions'

import { push } from 'connected-react-router'
import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from '../../constants'

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
}

const mapStateToProps = (state, ownProps: IFooter): IPropsFromRedux => ({
  language: ownProps.activeFile.language,
  currentHost: selectors.host.get(state),
  isWeb: selectors.host.getIsWeb(state),
})

interface IActionsFromRedux {
  onSettingsIconClick: () => void
  changeHost: (host: string) => void
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  onSettingsIconClick: () =>
    dispatch(
      editorActions.open({
        solutionId: SETTINGS_SOLUTION_ID,
        fileId: SETTINGS_FILE_ID,
      }),
    ),
  changeHost: (host: string) => dispatch(hostActions.change(host)),
})

export interface IFooter extends IPropsFromRedux, IActionsFromRedux {
  activeFile: IFile
  theme: ITheme // from withTheme
}

const Footer = ({
  language,
  theme,
  currentHost,
  isWeb,
  onSettingsIconClick,
  changeHost,
}: IFooter) => (
  <Wrapper>
    <Only when={isWeb}>
      <Customizer
        settings={{
          theme: createTheme({
            palette: {
              themePrimary: theme.primary,
              themeSecondary: theme.primary,
              themeDarkAlt: theme.primaryDark,
              themeDark: theme.primaryDark,
            },
          }),
        }}
      >
        <DefaultButton
          primary={true}
          text={currentHost}
          // TODO(nicobell): fix the hover color
          menuProps={{
            isBeakVisible: true,
            shouldFocusOnMount: true,
            items: Object.keys(HostType)
              .map(k => HostType[k])
              .filter(v => v !== currentHost)
              .map(v => ({
                key: v,
                text: v,
                onClick: () => changeHost(v),
                style: { color: theme.white },
              })),
            styles: props => ({
              root: {
                backgroundColor: theme.primary,
                color: theme.white,
              },
            }),
          }}
          styles={{
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
          }}
        />
      </Customizer>
    </Only>
    {languageMap[language.toLowerCase()] && (
      <BarButton>{languageMap[language.toLowerCase()]}</BarButton>
    )}
    <BarButton onClick={onSettingsIconClick}>
      <FabricIcon name="Settings" />
    </BarButton>
  </Wrapper>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(Footer))
