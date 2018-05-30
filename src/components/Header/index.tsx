import * as React from 'react'

import { createTheme } from 'office-ui-fabric-react/lib/Styling'
import { Customizer } from 'office-ui-fabric-react/lib/Utilities'

import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'

import { ISnippet, ISnippetMetadata } from '../../interfaces'

import SnippetSettings from './SnippetSettings'

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

interface IProps {
  // redux
  snippet: ISnippet
  updateSnippetMetadata: (
    snippetId: string,
    metadata: Partial<ISnippetMetadata>,
  ) => void
}

interface IState {
  showSnippetSettings: boolean
}

class Header extends React.Component<IProps, IState> {
  state = { showSnippetSettings: false }

  render() {
    const { snippet } = this.props

    return (
      <>
        <Customizer settings={{ theme: headerTheme }}>
          <CommandBar
            items={[
              {
                key: 'nav',
                iconOnly: true,
                iconProps: { iconName: 'GlobalNavButton' },
              },
              {
                key: 'SnippetName',
                text: snippet.metadata.name,
                onClick: this.openSnippetSettings,
              },
              {
                key: 'run',
                text: 'Run',
                iconProps: { iconName: 'Play' },
              },
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
            style={{ gridArea: 'header' }}
            styles={{ root: { paddingLeft: 0 } }}
          />
        </Customizer>
        <SnippetSettings
          isOpen={this.state.showSnippetSettings}
          closeSnippetSettings={this.closeSnippetSettings}
          snippet={snippet}
          updateSnippetMetadata={this.props.updateSnippetMetadata}
        />
      </>
    )
  }

  private openSnippetSettings = () =>
    this.setState({ showSnippetSettings: true })
  private closeSnippetSettings = () =>
    this.setState({ showSnippetSettings: false })
}

export default Header
