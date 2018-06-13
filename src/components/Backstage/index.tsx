import React, { Component } from 'react'
import { BackstageWrapper, NavMenu, NavMenuItem, ContentWrapper } from './styles'

// TODO: refactor to using Fabric Pivot, but due to styling issues, can't currently do that.

export default class Backstage extends Component {
  render() {
    return (
      <BackstageWrapper>
        <NavMenu>
          <NavMenuItem>New Snippet</NavMenuItem>
          <NavMenuItem>My Snippets</NavMenuItem>
          <NavMenuItem>Samples</NavMenuItem>
          <NavMenuItem>Import</NavMenuItem>
        </NavMenu>
        <ContentWrapper />
      </BackstageWrapper>
    )
  }
}
