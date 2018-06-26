import React from 'react'

import { DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Panel } from 'office-ui-fabric-react/lib/Panel'
import { Title, Subheader } from './styles'

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
