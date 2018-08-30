import React from 'react'
import { withTheme } from 'styled-components'
import PivotBar from '../../PivotBar'
import { Layout, Header, Content } from './styles'

import { connect } from 'react-redux'
import { customFunctions as customFunctionsActions } from '../../../store/actions'

interface IDashboardActionsFromRedux {
  onMount?: () => void
}

const mapDispatchToProps = (dispatch): IDashboardActionsFromRedux => ({
  onMount: () => dispatch(customFunctionsActions.fetchMetadata.request()),
})

interface IDashboard extends IDashboardActionsFromRedux {
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
    const { items, theme } = this.props

    return (
      <Layout>
        <Header>
          <PivotBar
            items={Object.keys(items).map(key => ({ key, text: key }))}
            selectedKey={selectedKey}
            onSelect={this.setSelectedKey}
            backgroundColor={theme.primary}
            selectedColor={theme.primaryDark}
          />
        </Header>
        <Content>{items[selectedKey]}</Content>
      </Layout>
    )
  }
}

export const Dashboard = withTheme(DashboardWithoutTheme)

export default connect(
  null,
  mapDispatchToProps,
)(Dashboard)
