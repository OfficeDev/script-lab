import React from 'react'
import styled, { withTheme } from 'styled-components'

import { Customizer } from 'office-ui-fabric-react/lib/Utilities'
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'
import { PersonaSize, PersonaCoin } from 'office-ui-fabric-react/lib/Persona'
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'

import Clipboard from 'clipboard'
import { convertSolutionToSnippet } from '../../../utils'
import YAML from 'js-yaml'

import SolutionSettings from './SolutionSettings'
import { ITheme as IFabricTheme } from 'office-ui-fabric-react/lib/Styling'
import { NULL_SOLUTION_ID, SETTINGS_SOLUTION_ID, PATHS } from '../../../constants'

import { connect } from 'react-redux'
import actions from '../../../store/actions'
import selectors from '../../../store/selectors'

import { getHeaderFabricTheme } from '../../../theme'
import { push } from 'connected-react-router'

const HeaderWrapper = styled.header`
  background-color: ${props => props.theme.primary};
  z-index: 1000;
`

interface IPropsFromRedux {
  profilePicUrl?: string
  isRunnableOnThisHost: boolean
  isSettingsView: boolean
  isCustomFunctionsView: boolean
  isLoggedIn: boolean
  headerFabricTheme: IFabricTheme
}

const mapStateToProps = (state): IPropsFromRedux => ({
  isSettingsView: selectors.settings.getIsOpen(state),
  isCustomFunctionsView: selectors.customFunctions.getIsCurrentSolutionCF(state),
  isLoggedIn: !!selectors.github.getToken(state),
  isRunnableOnThisHost: selectors.host.getIsRunnableOnThisHost(state),
  profilePicUrl: selectors.github.getProfilePicUrl(state),
  headerFabricTheme: getHeaderFabricTheme(selectors.host.get(state)),
})

interface IActionsFromRedux {
  login: () => void
  logout: () => void

  showBackstage: () => void
  closeSettings: () => void

  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => void
  deleteSolution: () => void

  createPublicGist: () => void
  createSecretGist: () => void
  updateGist: () => void

  notifyClipboardCopySuccess: () => void
  notifyClipboardCopyFailure: () => void

  navigateToCustomFunctions: () => void
}

const mapDispatchToProps = (dispatch, ownProps: IProps): IActionsFromRedux => ({
  login: () => dispatch(actions.github.login.request()),
  logout: () => dispatch(actions.github.logout()),

  showBackstage: () => dispatch(push(PATHS.BACKSTAGE)),
  closeSettings: () => dispatch(actions.settings.close()),

  editSolution: (solutionId: string, solution: Partial<IEditableSolutionProperties>) =>
    dispatch(actions.solutions.edit({ id: solutionId, solution })),
  deleteSolution: () => dispatch(actions.solutions.remove(ownProps.solution)),

  createPublicGist: () =>
    dispatch(
      actions.gists.create.request({ solutionId: ownProps.solution.id, isPublic: true }),
    ),
  createSecretGist: () =>
    dispatch(
      actions.gists.create.request({ solutionId: ownProps.solution.id, isPublic: false }),
    ),
  updateGist: () =>
    dispatch(actions.gists.update.request({ solutionId: ownProps.solution.id })),

  notifyClipboardCopySuccess: () =>
    dispatch(actions.messageBar.show('Snippet copied to clipboard.')),
  notifyClipboardCopyFailure: () =>
    dispatch(
      actions.messageBar.show(
        'Snippet failed to copy to clipboard.',
        MessageBarType.error,
      ),
    ),

  navigateToCustomFunctions: () => dispatch(actions.customFunctions.openDashboard()),
})

export interface IProps extends IPropsFromRedux, IActionsFromRedux {
  solution: ISolution
  theme: ITheme // from withTheme
}

interface IState {
  showSolutionSettings: boolean
}

class HeaderWithoutTheme extends React.Component<IProps, IState> {
  state = { showSolutionSettings: false }
  clipboard

  constructor(props: IProps) {
    super(props)
    this.clipboard = new Clipboard('.export-to-clipboard', { text: this.getSnippetYaml })
    this.clipboard.on('success', props.notifyClipboardCopySuccess)
    this.clipboard.on('error', props.notifyClipboardCopyFailure)
  }

  getSnippetYaml = (): string => YAML.dump(convertSolutionToSnippet(this.props.solution))

  render() {
    const {
      solution,
      showBackstage,
      editSolution,
      deleteSolution,
      isSettingsView,
      isCustomFunctionsView,
      profilePicUrl,
      isRunnableOnThisHost,
      isLoggedIn,
      theme,
      headerFabricTheme,
      logout,
      login,
      closeSettings,
      updateGist,
      createPublicGist,
      createSecretGist,
      navigateToCustomFunctions,
    } = this.props
    const isNullSolution = solution.id === NULL_SOLUTION_ID
    const solutionName = solution ? solution.name : 'Solution Name'

    const shareOptions = [
      {
        hidden: !(solution.source && solution.source.origin === 'gist' && isLoggedIn),
        key: 'update-gist',
        text: 'Update existing gist',
        iconProps: { iconName: 'Save' },
        onClick: updateGist,
      },
      {
        hidden: !isLoggedIn,
        key: 'new-public-gist',
        text: 'New public gist',
        iconProps: { iconName: 'PageCheckedIn' },
        onClick: createPublicGist,
      },
      {
        hidden: !isLoggedIn,
        key: 'new-secret-gist',
        text: 'New secret gist',
        iconProps: { iconName: 'ProtectedDocument' },
        onClick: createSecretGist,
      },
      {
        key: 'export-to-clipboard',
        text: 'Copy to clipboard',
        iconProps: {
          iconName: 'ClipboardSolid',
        },
        className: 'export-to-clipboard',
      },
    ]
      .filter(option => !option.hidden)
      .map(option => {
        const { hidden, ...rest } = option
        return rest
      })

    const nonSettingsButtons: ICommandBarItemProps[] = [
      {
        hidden: !isRunnableOnThisHost || isNullSolution || isCustomFunctionsView,
        key: 'run',
        text: 'Run',
        iconProps: { iconName: 'Play' },
        href: '/run.html',
      },
      {
        hidden: !isRunnableOnThisHost || !isCustomFunctionsView,
        key: 'register-cf',
        text: 'Register',
        iconProps: { iconName: 'Play' },
        onClick: navigateToCustomFunctions,
      },
      {
        hidden: isNullSolution,
        key: 'share',
        text: 'Share',
        iconProps: { iconName: 'Share' },
        subMenuProps: {
          items: shareOptions,
        },
      },
      {
        hidden: isNullSolution,
        key: 'delete',
        text: 'Delete',
        iconProps: { iconName: 'Delete' },
        onClick: deleteSolution,
      },
    ]
      .filter(({ hidden }) => !hidden)
      .map(option => {
        const { hidden, ...rest } = option
        return rest
      })

    const name = {
      hidden: isNullSolution,
      key: 'solution-name',
      text: solutionName,
      onClick: isSettingsView ? undefined : this.openSolutionSettings,
      style: { paddingRight: '2rem' },
    }

    const nav = {
      hidden: isSettingsView,
      key: 'nav',
      ariaLabel: 'Backstage',
      iconOnly: true,
      iconProps: { iconName: 'GlobalNavButton' },
      onClick: showBackstage,
    }

    const back = {
      hidden: !isSettingsView,
      key: 'back',
      ariaLabel: 'Back',
      iconOnly: true,
      iconProps: { iconName: 'Back' },
      onClick: closeSettings,
    }

    const commonItems = [back, nav, name].filter(({ hidden }) => !hidden).map(option => {
      const { hidden, ...rest } = option
      return rest
    })

    const items: ICommandBarItemProps[] = [
      ...commonItems,
      ...(isSettingsView ? [] : nonSettingsButtons),
    ].filter(item => item !== null)

    const profilePic = {
      key: 'account',
      onRenderIcon: () => (
        <div style={{ width: '28px', overflow: 'hidden' }}>
          <PersonaCoin
            imageUrl={profilePicUrl}
            size={PersonaSize.size28}
            initialsColor="white"
            styles={{
              initials: {
                color: (theme && theme.primary) || 'black',
              },
            }}
          />
        </div>
      ),
      ariaLabel: isLoggedIn ? 'Logout' : 'Login',
      subMenuProps: isLoggedIn
        ? {
            items: [
              {
                key: 'logout',
                text: 'Logout',
                onClick: logout,
              },
            ],
          }
        : undefined,
      iconOnly: true,
      onClick: login,
    }

    return (
      <>
        <Customizer settings={{ theme: headerFabricTheme }}>
          <HeaderWrapper>
            <CommandBar
              items={items}
              styles={{
                root: { paddingLeft: 0, paddingRight: 0 },
              }}
              farItems={[profilePic]}
            />
          </HeaderWrapper>
        </Customizer>

        {solution && (
          <SolutionSettings
            isOpen={this.state.showSolutionSettings}
            closeSolutionSettings={this.closeSolutionSettings}
            solution={solution}
            editSolutionMetadata={editSolution}
          />
        )}
      </>
    )
  }

  private openSolutionSettings = () => this.setState({ showSolutionSettings: true })
  private closeSolutionSettings = () => this.setState({ showSolutionSettings: false })
}

export const Header = withTheme(HeaderWithoutTheme)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)
