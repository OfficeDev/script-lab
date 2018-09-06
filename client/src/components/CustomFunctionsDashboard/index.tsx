import React from 'react'

import Dashboard from './Dashboard'

import Summary from './Summary'
import Console from './Console'

import ComingSoon from './ComingSoon'
import Welcome from './Welcome'

import LoadingIndicator from '../LoadingIndicator'

import { connect } from 'react-redux'
import selectors from '../../store/selectors'

import { getIsCustomFunctionsSupportedOnHost } from '../../utils/customFunctions'

interface IPropsFromRedux {
  hasCustomFunctionsInSolutions: boolean
}

const mapStateToProps = (state): IPropsFromRedux => ({
  hasCustomFunctionsInSolutions: selectors.customFunctions.getSolutions(state).length > 0,
})

interface ICustomFunctionsDashboard extends IPropsFromRedux {}

interface IState {
  isCFSupportedOnHost: boolean | undefined
}

export class CustomFunctionsDashboard extends React.Component<
  ICustomFunctionsDashboard,
  IState
> {
  state = { isCFSupportedOnHost: undefined }

  constructor(props) {
    super(props)

    getIsCustomFunctionsSupportedOnHost().then((isCFSupportedOnHost: boolean) => {
      this.setState({ isCFSupportedOnHost })
    })
  }

  render() {
    const { isCFSupportedOnHost } = this.state
    const { hasCustomFunctionsInSolutions } = this.props

    if (isCFSupportedOnHost === undefined) {
      return (
        <LoadingIndicator ballSize={32} numBalls={5} ballColor="#d83b01" delay={0.05} />
      )
    } else if (isCFSupportedOnHost) {
      if (hasCustomFunctionsInSolutions) {
        return <Dashboard items={{ Summary: <Summary />, Console: <Console /> }} />
      } else {
        return <Welcome />
      }
    } else {
      return <ComingSoon />
    }
  }
}

export default connect(mapStateToProps)(CustomFunctionsDashboard)
