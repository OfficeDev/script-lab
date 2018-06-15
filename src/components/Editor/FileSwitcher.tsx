import React from 'react'
import styled from 'styled-components'

import { Pivot, PivotItem } from '../'

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
        <Pivot>
          {files.map(file => (
            <PivotItem
              key={file.id}
              isSelected={file.id === activeFile.id}
              onSelect={this.handleLinkClick(file)}
            >
              {FILE_NAME_MAP[file.name] || file.name}
            </PivotItem>
          ))}
        </Pivot>
      </FileSwitcherWrapper>
    )
  }
  private handleLinkClick = (file: any) => () => {
    this.props.changeActiveFile(file)
  }
}

export default FileSwitcher
