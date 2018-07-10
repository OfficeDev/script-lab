import React from 'react'
import styled from 'styled-components'
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
} from 'office-ui-fabric-react/lib/Pivot'

import { createTheme } from 'office-ui-fabric-react/lib/Styling'
import { Customizer } from 'office-ui-fabric-react/lib/Utilities'

const pivotTheme = createTheme({
  palette: {
    themePrimary: '#0a331f',
    themeLighterAlt: '#f2f9f5',
    themeLighter: '#cee9da',
    themeLight: '#a8d5bc',
    themeTertiary: '#62ab83',
    themeSecondary: '#318456',
    themeDarkAlt: '#1e673f',
    themeDark: '#195735',
    themeDarker: '#134027',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#134027',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#c2c2c2',
    neutralSecondary: '#858585',
    neutralPrimaryAlt: '#4b4b4b',
    neutralPrimary: '#fff',
    neutralDark: '#272727',
    black: '#fff',
    white: '#fff',
  },
})

const FileSwitcherWrapper = styled.div`
  grid-area: command-bar;
  background-color: ${props => props.theme.darkAccent};
`

const FILE_NAME_MAP = {
  'index.ts': 'Script',
  'index.html': 'HTML',
  'index.css': 'CSS',
  'libraries.txt': 'Libraries',
}

interface IFileSwitcherProps {
  files: any[]
  activeFile: any
  changeActiveFile: (file: any) => void
}

class FileSwitcher extends React.Component<IFileSwitcherProps> {
  render() {
    const { files, activeFile, changeActiveFile } = this.props
    const activeFileName = activeFile ? activeFile.name : ''

    return (
      <FileSwitcherWrapper>
        <div>
          <Customizer settings={{ theme: pivotTheme }}>
            <Pivot
              linkSize={PivotLinkSize.normal}
              linkFormat={PivotLinkFormat.tabs}
              onLinkClick={this.onLinkClick}
            >
              {files.map(file => (
                <PivotItem
                  key={file.id}
                  itemKey={file.id}
                  linkText={FILE_NAME_MAP[file.name] || file.name}
                />
              ))}
              {/* <PivotItem itemKey="1" linkText="Foo" />
            <PivotItem itemKey="2" linkText="Bar" />
            <PivotItem key={3} linkText="Smhoo" /> */}
            </Pivot>
          </Customizer>
        </div>
        {/* <Pivot>
          {files.map(file => (
            <PivotItem
              key={file.id}
              isSelected={file.id === activeFile.id}
              onSelect={this.handleLinkClick(file)}
            >
              {FILE_NAME_MAP[file.name] || file.name}
            </PivotItem>
          ))}
        </Pivot> */}
      </FileSwitcherWrapper>
    )
  }
  private handleLinkClick = (file: any) => () => {
    this.props.changeActiveFile(file)
  }

  onLinkClick = (item: PivotItem): void =>
    // alert(`${item.props.linkText} ${item.props.itemKey}`)
    this.props.changeActiveFile(
      this.props.files.find(file => file.id === item.props.itemKey),
    )
}

export default FileSwitcher
