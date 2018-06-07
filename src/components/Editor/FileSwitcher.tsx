import React from 'react'
import styled from 'styled-components'

import { PivotBar, Pivot } from '../'

const FileSwitcherWrapper = styled.div`
  grid-area: command-bar;
  background-color: ${props => props.theme.darkAccent};
`

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
        <PivotBar>
          {files.map(file => (
            <Pivot
              key={file.id}
              isActive={file.id === activeFile.id}
              onSelect={this.handleLinkClick(file)}
            >
              {file.name}
            </Pivot>
          ))}
        </PivotBar>
      </FileSwitcherWrapper>
    )
  }
  private handleLinkClick = (file: any) => () => {
    this.props.changeActiveFile(file)
  }
}

export default FileSwitcher
