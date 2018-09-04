import React from 'react'
import { withTheme } from 'styled-components'
import PivotBar from '../../PivotBar'
import { Layout, Header, Content } from './styles'

import { Customizer } from 'office-ui-fabric-react/lib/Utilities'
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'
import { ITheme as IFabricTheme } from '@uifabric/styling'
import { getHeaderFabricTheme } from '../../../theme'

import { connect } from 'react-redux'
import selectors from '../../../store/selectors'
import { customFunctions as customFunctionsActions } from '../../../store/actions'
import { goBack } from 'connected-react-router'

interface IPropsFromRedux {
  headerFabricTheme: IFabricTheme
}

const mapStateToProps = (state): IPropsFromRedux => ({
  headerFabricTheme: getHeaderFabricTheme(selectors.host.get(state)),
})

interface IActionsFromRedux {
  onMount?: () => void
  goBack: () => void
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  onMount: () => dispatch(customFunctionsActions.fetchMetadata.request()),
  goBack: () => dispatch(goBack()),
})

interface IDashboard extends IPropsFromRedux, IActionsFromRedux {
  items: { [itemName: string]: any /* react component */ }
  theme: ITheme // from withTheme
}

interface IState {
  selectedKey: string
}

class DashboardWithoutTheme extends React.Component<IDashboard, IState> {
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

  render() {
    const { selectedKey } = this.state
    const { items, theme, headerFabricTheme, goBack } = this.props

    return (
      <Layout>
        <Header>
          <Customizer settings={{ theme: headerFabricTheme }}>
            <CommandBar
              items={[
                {
                  key: 'go-back',
                  iconOnly: true,
                  iconProps: { iconName: 'Back' },
                  onClick: goBack,
                },
                {
                  key: 'title',
                  text: 'Custom Functions (Preview)',
                },
              ]}
              styles={{
                root: { paddingLeft: 0, paddingRight: 0 },
              }}
            />
          </Customizer>
          <PivotBar
            items={Object.keys(items).map(key => ({ key, text: key }))}
            selectedKey={selectedKey}
            onSelect={this.setSelectedKey}
          />
        </Header>
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
