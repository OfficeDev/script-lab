import React from 'react'

import { connect } from 'react-redux'
import actions from '../../store/actions'

interface IActionsFromRedux {
  updateWidth: (width: number) => void
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  updateWidth: (width: number) => dispatch(actions.screen.updateWidth(width)),
})

interface IProps extends IActionsFromRedux {}

export class WidthMonitor extends React.Component<IProps> {
  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => this.props.updateWidth(window.innerWidth)

  render() {
    return null
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(WidthMonitor)
