import React from 'react'
import styled from 'styled-components'

import { createTheme } from 'office-ui-fabric-react/lib/Styling'
import { Customizer } from 'office-ui-fabric-react/lib/Utilities'

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'

import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
  PersonaCoin,
} from 'office-ui-fabric-react/lib/Persona'

import SolutionSettings from './SolutionSettings'

const headerTheme = createTheme({
  palette: {
    themePrimary: '#ffffff',
    themeLighterAlt: '#767676',
    themeLighter: '#a6a6a6',
    themeLight: '#c8c8c8',
    themeTertiary: '#d0d0d0',
    themeSecondary: '#dadada',
    themeDarkAlt: '#eaeaea',
    themeDark: '#f4f4f4',
    themeDarker: '#f8f8f8',
    neutralLighterAlt: '#27794c',
    neutralLighter: '#217346' /*'#2c7e51',*/,
    neutralLight: '#35875a',
    neutralQuaternaryAlt: '#3b8d60',
    neutralQuaternary: '#409165',
    neutralTertiaryAlt: '#58a47a',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#0D4027', // '#217346',
  },
})

const HeaderWrapper = styled.header`
  grid-area: header;
  background-color: ${props => props.theme.accent};
`

interface IHeader {
  showBackstage: () => void
  solution: ISolution
  // redux
  profilePic?: string
  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => void
  login: () => void
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
    const { solution, showBackstage } = this.props
    const solutionName = solution ? solution.name : 'Solution Name'

    const shareOptions = [
      {
        hidden: solution.source && solution.source.origin === 'gist',
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
    return (
      <>
        <Customizer settings={{ theme: headerTheme }}>
          <HeaderWrapper>
            <CommandBar
              items={[
                {
                  key: 'nav',
                  iconOnly: true,
                  iconProps: { iconName: 'GlobalNavButton' },
                  onClick: showBackstage,
                },
                {
                  key: solutionName,
                  text: solutionName,
                  onClick: this.openSolutionSettings,
                },
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
                },
              ]}
              styles={{
                root: { paddingLeft: 0, paddingRight: 0 },
              }}
              farItems={[
                {
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
                  iconOnly: true,
                  onClick: this.props.login,
                },
              ]}
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
