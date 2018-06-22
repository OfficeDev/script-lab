import React from 'react'
import styled from 'styled-components'

import { createTheme } from 'office-ui-fabric-react/lib/Styling'
import { Customizer } from 'office-ui-fabric-react/lib/Utilities'

import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'

import {
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
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
    neutralLighter: '#2c7e51',
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
    white: '#217346',
  },
})

const HeaderWrapper = styled.header`
  grid-area: header;
  background-color: ${props => props.theme.accent};
  display: flex;
  align-items: center;
`

interface IHeader {
  showBackstage: () => void
  // redux
  solution: any
  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => void
}

interface IState {
  showSolutionSettings: boolean
}

class Header extends React.Component<IHeader, IState> {
  state = { showSolutionSettings: false }

  render() {
    const { solution, showBackstage } = this.props
    const solutionName = solution ? solution.name : 'Solution Name'

    return (
      <>
        <Customizer settings={{ theme: headerTheme }}>
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
              { key: 'run', text: 'Run', iconProps: { iconName: 'Play' } },
              {
                key: 'share',
                text: 'Share',
                iconProps: { iconName: 'Share' },
              },
              {
                key: 'delete',
                text: 'Delete',
                iconProps: { iconName: 'Delete' },
              },
            ]}
            farItems={[
              {
                key: 'user',
                onRender: () => (
                  <div style={{ width: '32px' }}>
                    <Persona
                      imageUrl="https://lh3.googleusercontent.com/-e2y2T1aiT00/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq09tgaWz7fRfJi2ZBfVc5Tiup5Elw/s96-c-mo/photo.jpg"
                      size={PersonaSize.size32}
                      presence={PersonaPresence.online}
                    />
                  </div>
                ),
              },
            ]}
            styles={{
              root: { paddingLeft: 0 },
            }}
          />
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
