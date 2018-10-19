import React from 'react'
import { withTheme } from 'styled-components'
import PivotBar from '../../PivotBar'
import { Layout, Header, Content } from './styles'

import { Customizer, filteredAssign } from 'office-ui-fabric-react/lib/Utilities'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'
import { ITheme as IFabricTheme } from 'office-ui-fabric-react/lib/Styling'
import { getCommandBarFabricTheme } from '../../../theme'

import { connect } from 'react-redux'
import { IState as IReduxState } from '../../../store/reducer'
import selectors from '../../../store/selectors'
import { customFunctions as customFunctionsActions } from '../../../store/actions'
import { goBack } from 'connected-react-router'
import Only from '../../Only'

interface IPropsFromRedux {
  commandBarFabricTheme: IFabricTheme
  isStandalone: boolean
}

const mapStateToProps = (state: IReduxState): IPropsFromRedux => ({
  commandBarFabricTheme: getCommandBarFabricTheme(selectors.host.get(state)),
  isStandalone: selectors.customFunctions.getIsStandalone(state),
})

interface IActionsFromRedux {
  onMount?: () => void
  goBack?: () => void
}

const mapDispatchToProps = (dispatch, ownProps): IActionsFromRedux => ({
  onMount: () => dispatch(customFunctionsActions.fetchMetadata.request()),
  goBack: !ownProps.isStandalone ? () => dispatch(goBack()) : undefined,
})

interface IProps extends IPropsFromRedux, IActionsFromRedux {
  shouldPromptRefresh: boolean
  items: { [itemName: string]: any /* react component */ }
  theme: ITheme // from withTheme
}

interface IState {
  selectedKey: string
}

class DashboardWithoutTheme extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    const selectedKey =
      Object.keys(props.items).length > 0 ? Object.keys(props.items)[0] : ''
    this.state = { selectedKey }
  }

  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount()
    }
  }

  setSelectedKey = (selectedKey: string) => this.setState({ selectedKey })

  reload = () => window.location.reload()

  render() {
    const { selectedKey } = this.state
    const {
      items,
      theme,
      isStandalone,
      commandBarFabricTheme,
      goBack,
      shouldPromptRefresh,
    } = this.props

    const goBackItem = {
      key: 'go-back',
      iconOnly: true,
      iconProps: { iconName: 'Back' },
      onClick: goBack,
    }

    const titleItem = {
      key: 'title',
      text: 'Custom Functions (Preview)',
      onClick: this.reload,
    }

    const headerItems = !isStandalone ? [goBackItem, titleItem] : [titleItem]

    return (
      <Layout>
        <Header>
          <Customizer settings={{ theme: commandBarFabricTheme }}>
            <CommandBar
              items={headerItems}
              styles={{ root: { paddingLeft: 0, paddingRight: 0 } }}
            />
          </Customizer>
          <PivotBar
            items={Object.keys(items).map(key => ({
              key,
              text: key,
            }))}
            selectedKey={selectedKey}
            onSelect={this.setSelectedKey}
          />
        </Header>
        <Only when={shouldPromptRefresh}>
          <MessageBar
            messageBarType={MessageBarType.info}
            isMultiline={false}
            actions={
              <div>
                <DefaultButton primary={true} onClick={this.reload}>
                  Reload
                </DefaultButton>
              </div>
            }
          >
            You have made changes to your Custom Functions. Would you like to re-register?
          </MessageBar>
        </Only>
        <Content>{items[selectedKey]}</Content>
      </Layout>
    )
  }
}

export const Dashboard = withTheme(DashboardWithoutTheme)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard)
