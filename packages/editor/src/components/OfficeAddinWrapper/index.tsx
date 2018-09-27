import React from 'react'

interface IProps {
  children: any
}

interface IState {
  isOfficeReady: boolean
}

class OfficeAddinWrapper extends React.Component<IProps, IState> {
  state = { isOfficeReady: false }

  componentDidMount() {
    Office.onReady(() => this.setState({ isOfficeReady: true }))
  }

  render() {
    return <div />
  }
}
