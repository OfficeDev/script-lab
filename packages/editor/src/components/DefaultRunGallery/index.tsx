import React from 'react'
import { RunPane, RunButton, FunctionName, FunctionWrapper } from './styles'

export class DefaultRunGallery extends React.Component {
  render() {
    return (
      <RunPane>
        <FunctionWrapper>
          <RunButton />
          <FunctionName>Foo</FunctionName>
        </FunctionWrapper>
      </RunPane>
    )
  }
}

export default DefaultRunGallery
