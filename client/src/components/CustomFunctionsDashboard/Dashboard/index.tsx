import React from 'react'
import { withTheme } from 'styled-components'
import PivotBar from '../../PivotBar'
import { Layout, Header, Content } from './styles'

interface ICustomFunctionsDashboard {
  items: { [itemName: string]: any /* react component */ }
  theme: ITheme // from withTheme
}

interface IState {
  selectedKey: string
}

class CustomFunctionsDashboard extends React.Component<
  ICustomFunctionsDashboard,
  IState
> {
  constructor(props) {
    super(props)
    const selectedKey =
      Object.keys(props.items).length > 0 ? Object.keys(props.items)[0] : ''
    this.state = { selectedKey }
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

export default withTheme(CustomFunctionsDashboard)
