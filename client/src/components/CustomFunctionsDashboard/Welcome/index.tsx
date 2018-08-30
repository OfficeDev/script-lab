import React from 'react'
import { DefaultButton } from 'office-ui-fabric-react/lib/Button'
import {
  CenteredContent,
  WelcomeTitle,
  WelcomeSubTitle,
  Seperator,
  Instructions,
  InstructionsDescription,
  List,
  ListItem,
  CodeBlock,
} from './styles'

import { connect } from 'react-redux'
import { IState as IReduxState } from '../../../store/reducer'
import selectors from '../../../store/selectors'

interface IWelcomePropsFromRedux {
  isRefreshEnabled: boolean
}

const mapStateToProps = (state: IReduxState): IWelcomePropsFromRedux => ({
  isRefreshEnabled:
    selectors.solutions.getEditorLastModifiedDate(state) >
    state.customFunctions.runner.lastUpdated,
})

interface IWelcomeActionsFromRedux {
  refresh: () => void
}

const mapDispatchToProps = (state): IWelcomeActionsFromRedux => ({
  refresh: () => {}, // TODO:(nicobell)
})

interface IWelcome extends IWelcomePropsFromRedux, IWelcomeActionsFromRedux {}

export const Welcome = ({ isRefreshEnabled, refresh }: IWelcome) => (
  <CenteredContent>
    <WelcomeTitle>Welcome</WelcomeTitle>
    <WelcomeSubTitle>
      Discover what custom functions can do for you today!
    </WelcomeSubTitle>
    <Seperator />
    <Instructions>
      <InstructionsDescription>
        Get started with your first custom function.
      </InstructionsDescription>
      <List>
        <ListItem>Open the code editor.</ListItem>
        <ListItem>
          Copy the following script and paste it into the editor.
          <CodeBlock>
            <pre>{'/** @CustomFunction */'}</pre>
            <pre>function add10(x: number): number {'{'}</pre>
            <pre> return x + 10;</pre>
            <pre>{'}'}</pre>
          </CodeBlock>
        </ListItem>
        <ListItem>
          After pasting, click the <strong>Refresh</strong> button below.
        </ListItem>
      </List>
      <DefaultButton
        primary
        disabled={!isRefreshEnabled}
        onClick={refresh}
        text="Refresh"
        style={{
          display: 'block',
          margin: '0 auto',
        }}
      />
    </Instructions>
  </CenteredContent>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Welcome)
