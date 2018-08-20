import React from 'react'
import styled from 'styled-components'

import { Customizer } from 'office-ui-fabric-react/lib/Utilities'
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'
import { PersonaSize, PersonaCoin } from 'office-ui-fabric-react/lib/Persona'

import Clipboard from 'clipboard'
import { convertSolutionToSnippet } from '../../utils'
import YAML from 'yamljs'

import SolutionSettings from './SolutionSettings'
import { ITheme as IFabricTheme } from 'office-ui-fabric-react/lib/Styling'
import { NULL_SOLUTION_ID } from '../../constants'

import { connect } from 'react-redux'
import { solutions, github, gists, messageBar } from '../../store/actions'
import selectors from '../../store/selectors'

import { SETTINGS_SOLUTION_ID } from '../../constants'
import { getHeaderFabricTheme } from '../../theme'
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { goBack } from 'connected-react-router'
import { getIsRunnableOnThisHost } from '../../store/host/selectors'

const HeaderWrapper = styled.header`
  grid-area: header;
  background-color: ${props => props.theme.primary};
`

interface IPropsFromRedux {
  profilePicUrl?: string
  isRunnableOnThisHost: boolean
  isSettingsView: boolean
  isLoggedIn: boolean
  headerFabricTheme: IFabricTheme
}

const mapStateToProps = (state, ownProps: IHeader): IPropsFromRedux => ({
  isSettingsView: ownProps.solution.id === SETTINGS_SOLUTION_ID,
  isLoggedIn: !!selectors.github.getToken(state),
  isRunnableOnThisHost: selectors.host.getIsRunnableOnThisHost(state),
  profilePicUrl: selectors.github.getProfilePicUrl(state),
  headerFabricTheme: getHeaderFabricTheme(selectors.host.get(state)),
})

interface IActionsFromRedux {
  login: () => void
  logout: () => void

  goBack: () => void

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
}

const mapDispatchToProps = (dispatch, ownProps: IHeader): IActionsFromRedux => ({
  login: () => dispatch(github.login.request()),
  logout: () => dispatch(github.logout()),

  goBack: () => dispatch(goBack()),

  editSolution: (solutionId: string, solution: Partial<IEditableSolutionProperties>) =>
    dispatch(solutions.edit({ id: solutionId, solution })),
  deleteSolution: () => dispatch(solutions.remove(ownProps.solution)),

  createPublicGist: () =>
    dispatch(gists.create.request({ solutionId: ownProps.solution.id, isPublic: true })),
  createSecretGist: () =>
    dispatch(gists.create.request({ solutionId: ownProps.solution.id, isPublic: false })),
  updateGist: () => dispatch(gists.update.request({ solutionId: ownProps.solution.id })),
  notifyClipboardCopySuccess: () =>
    dispatch(messageBar.show('Snippet copied to clipboard.')),
  notifyClipboardCopyFailure: () =>
    dispatch(
      messageBar.show('Snippet failed to copy to clipboard.', MessageBarType.error),
    ),
})

export interface IHeader extends IPropsFromRedux, IActionsFromRedux {
  solution: ISolution
  showBackstage: () => void
}

interface IState {
  showSolutionSettings: boolean
}

export class Header extends React.Component<IHeader, IState> {
  state = { showSolutionSettings: false }
  clipboard

  constructor(props: IHeader) {
    super(props)
    this.clipboard = new Clipboard('.export-to-clipboard', { text: this.getSnippetYaml })
    this.clipboard.on('success', props.notifyClipboardCopySuccess)
    this.clipboard.on('error', props.notifyClipboardCopyFailure)
  }

  getSnippetYaml = (): string =>
    YAML.stringify(convertSolutionToSnippet(this.props.solution))

  render() {
    const {
      solution,
      showBackstage,
      editSolution,
      deleteSolution,
      isSettingsView,
      profilePicUrl,
      isRunnableOnThisHost,
      isLoggedIn,
      headerFabricTheme,
      logout,
      login,
      goBack,
      updateGist,
      createPublicGist,
      createSecretGist,
    } = this.props

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
        hidden: !isRunnableOnThisHost || solution.id === NULL_SOLUTION_ID,
        key: 'run',
        text: 'Run',
        iconProps: { iconName: 'Play' },
        href: '/run.html',
      },
      {
        hidden: solution.id === NULL_SOLUTION_ID,
        key: 'share',
        text: 'Share',
        iconProps: { iconName: 'Share' },
        subMenuProps: {
          items: shareOptions,
        },
      },
      {
        hidden: solution.id === NULL_SOLUTION_ID,
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
      hidden: solution.id === NULL_SOLUTION_ID,
      key: solutionName,
      text: solutionName,
      onClick: isSettingsView ? undefined : this.openSolutionSettings,
    }

    const nav = {
      hidden: isSettingsView,
      key: 'nav',
      iconOnly: true,
      iconProps: { iconName: 'GlobalNavButton' },
      onClick: showBackstage,
    }

    const back = {
      hidden: !isSettingsView,
      key: 'back',
      iconOnly: true,
      iconProps: { iconName: 'Back' },
      onClick: goBack,
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
            styles={{
              coin: { backgroundColor: 'brick' },
              image: { backgroundColor: 'white' },
              initials: {
                backgroundColor: '#000',
                color: 'green',
              },
            }}
          />
        </div>
      ),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)
