import React from 'react'

import { DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { Title, Subheader, Divider, Bodytext, Listtext, Codeblock } from './styles'

export default class WelcomePanel extends React.Component<
  {},
  {
    showPanel: boolean
  }
> {
  constructor(props: {}) {
    super(props)
    this.state = { showPanel: false }
  }

  render(): JSX.Element {
    return (
      <div>
        <DefaultButton text="Open panel" onClick={this.showPanel} />
        <Panel
          isOpen={this.state.showPanel}
          isHiddenOnDismiss={true}
          headerText=""
          onDismiss={this.hidePanel}
        >
          {/* TODO: content goes here */}
          <Title>Welcome</Title>
          <Subheader>Discover what Custom functions can do for you today!</Subheader>
          <Divider />
          <Bodytext>Get started with your first custom functions.</Bodytext>
          <Listtext>1. Open the Code Editor</Listtext>
          <Listtext>2. Copy the following script and paste into the editor.</Listtext>
          <Listtext>3. Choose refresh to run custom functions.</Listtext>
        </Panel>
      </div>
    )
  }

  private showPanel = (): void => {
    this.setState({ showPanel: true })
  }

  private hidePanel = (): void => {
    this.setState({ showPanel: false })
  }
}
