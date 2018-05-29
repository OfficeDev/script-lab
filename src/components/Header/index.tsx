import * as React from 'react'
import styled from 'styled-components'

import { BarButton, FabricIcon, Label, UserPresence } from '../'
import SnippetSettings from './SnippetSettings'
import { ISnippet, ISnippetMetadata } from '../../interfaces'

const HeaderWrapper = styled.header.attrs({ className: 'ms-font-l' })`
  grid-area: header;

  display: flex;
  align-items: center;

  background: ${props => props.theme.accent};
`

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
        <HeaderWrapper>
          <BarButton>
            <FabricIcon name="GlobalNavButton" />
          </BarButton>
          <BarButton onClick={this.openSnippetSettings}>
            <Label>{snippet.metadata.name}</Label>
          </BarButton>
          <BarButton>
            <FabricIcon name="Play" />
            <Label>Run</Label>
          </BarButton>
          <BarButton>
            <FabricIcon name="Share" />
            <Label>Share</Label>
          </BarButton>
          <BarButton>
            <FabricIcon name="Delete" />
            <Label>Delete</Label>
          </BarButton>
          <UserPresence />
        </HeaderWrapper>
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
