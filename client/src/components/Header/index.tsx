import React from 'react'
import styled from 'styled-components'

import { Customizer } from 'office-ui-fabric-react/lib/Utilities'

import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'

import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
  PersonaCoin,
} from 'office-ui-fabric-react/lib/Persona'
import SolutionSettings from './SolutionSettings'

import { headerTheme } from '../../theme'

const HeaderWrapper = styled.header`
  grid-area: header;
  background-color: ${props => props.theme.accent};
`

export interface IHeader {
  showBackstage: () => void
  solution: ISolution
  // redux
  profilePic?: string
  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => void
  isSettingsSolution: boolean
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  deleteSolution: () => void
  createPublicGist: () => void
  createSecretGist: () => void
  updateGist: () => void
}

interface IState {
  showSolutionSettings: boolean
}

class Header extends React.Component<IHeader, IState> {
  state = { showSolutionSettings: false }

  render() {
    // TODO: clean up all of this imperative code
    const { solution, showBackstage, isSettingsSolution } = this.props
    const solutionName = solution ? solution.name : 'Solution Name'

    const shareOptions = [
      {
        hidden: !(solution.source && solution.source.origin === 'gist'),
        key: 'update-gist',
        text: 'Update existing gist',
        iconProps: { iconName: 'Save' },
        onClick: this.props.updateGist,
      },
      {
        key: 'new-public-gist',
        text: 'New public gist',
        iconProps: { iconName: 'PageCheckedIn' },
        onClick: this.props.createPublicGist,
      },
      {
        key: 'new-secret-gist',
        text: 'New secret gist',
        iconProps: { iconName: 'ProtectedDocument' },
        onClick: this.props.createSecretGist,
      },
    ]
      .filter(option => !option.hidden)
      .map(option => {
        const { hidden, ...rest } = option
        return rest
      })

    const profilePic = {
      key: 'account',
      onRenderIcon: () => (
        <div style={{ width: '28px', overflow: 'hidden' }}>
          <PersonaCoin
            imageUrl={this.props.profilePic}
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
      subMenuProps: this.props.isLoggedIn
        ? {
            items: [
              {
                key: 'logout',
                text: 'Logout',
                onClick: this.props.logout,
              },
            ],
          }
        : undefined,
      iconOnly: true,
      onClick: this.props.login,
    }

    const nonSettingsButtons = [
      {
        key: 'run',
        text: 'Run',
        iconProps: { iconName: 'Play' },
        href: '/run.html',
      },
      {
        key: 'share',
        text: 'Share',
        iconProps: { iconName: 'Share' },
        subMenuProps: {
          items: shareOptions,
        },
      },
      {
        key: 'delete',
        text: 'Delete',
        iconProps: { iconName: 'Delete' },
        onClick: this.props.deleteSolution,
      },
    ]

    let items: ICommandBarItemProps[] = [
      {
        key: 'nav',
        iconOnly: true,
        iconProps: { iconName: 'GlobalNavButton' },
        onClick: showBackstage,
      },
      {
        key: solutionName,
        text: solutionName,
        onClick: isSettingsSolution ? undefined : this.openSolutionSettings,
      },
    ]

    if (!isSettingsSolution) {
      items = [...items, ...nonSettingsButtons]
    }

    return (
      <>
        <Customizer settings={{ theme: headerTheme }}>
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
            editSolutionMetadata={this.props.editSolution}
          />
        )}
      </>
    )
  }

  private openSolutionSettings = () => this.setState({ showSolutionSettings: true })
  private closeSolutionSettings = () => this.setState({ showSolutionSettings: false })
}

export default Header
