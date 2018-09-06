import React, { Component } from 'react'
import { withTheme } from 'styled-components'
import ReactDOM from 'react-dom'
import { GalleryListWrapper, TitleBar, Title, ArrowWrapper } from './styles'

import GalleryListItem, { IGalleryListItem } from './GalleryListItem'
import FabricIcon from '../../FabricIcon'

export interface IProps {
  title: string
  items: IGalleryListItem[]
  theme: ITheme // from withTheme
}

interface IState {
  isExpanded: boolean
  focusedItemIndex: number | null
}

class GalleryList extends Component<IProps, IState> {
  state = { isExpanded: true, focusedItemIndex: null }

  constructor(props) {
    super(props)
  }

  toggleExpansion = () => this.setState({ isExpanded: !this.state.isExpanded })

  onKeyDown = e => {
    const index = this.state.focusedItemIndex
    console.log({ keyCode: e.keyCode, index })
    if (e.keyCode === 38) {
      const newIndex = index !== null ? index - 1 : 0
      this.setState({ focusedItemIndex: Math.max(0, newIndex) })
    } else if (e.keyCode === 40) {
      const newIndex = index !== null ? index + 1 : 0
      this.setState({
        focusedItemIndex: Math.min(this.props.items.length - 1, newIndex),
      })
    } else if (e.keyCode === 9) {
      this.setState({ focusedItemIndex: null })
    } else if (e.keyCode === 32) {
      if (index !== null) {
        const {onClick} = this.props.items[index]
        if (onClick) {
          onClick()
        }
      }
    }
    this.forceUpdate()
  }

  componentDidUpdate() {
    const ref = ReactDOM.findDOMNode(this.refs.thisDiv) as any
    if (ref) {
      ref.focus()
    }
  }

  render() {
    const { title, items, theme } = this.props
    const { isExpanded } = this.state
    return (
      <GalleryListWrapper tabIndex={0} onKeyDown={this.onKeyDown}>
        <TitleBar>
          <Title>{title}</Title>
          <ArrowWrapper onClick={this.toggleExpansion}>
            <FabricIcon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
          </ArrowWrapper>
        </TitleBar>
        {isExpanded &&
          items.map((item, i) => {
            return this.state.focusedItemIndex === i ? (
              <div
                ref="thisDiv"
                tabIndex={0}
                key={item.key}
                style={{ color: theme.white, backgroundColor: theme.primary }}
              >
                <GalleryListItem {...item} />
              </div>
            ) : (
              <GalleryListItem key={item.key} {...item} />
            )
          })}
      </GalleryListWrapper>
    )
  }
}

export default withTheme(GalleryList)
