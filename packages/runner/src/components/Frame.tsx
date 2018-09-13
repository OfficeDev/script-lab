import React from 'react'

interface IProps {
  message: string
}
// interface IState {
//   isMounted: boolean
// }

class Frame extends React.Component<IProps> {
  node // ref to iframe node
  _isMounted: boolean

  constructor(props) {
    super(props)
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true

    const doc = this.getContentDoc()
    if (doc && doc.readyState === 'complete') {
      this.forceUpdate()
    } else {
      this.node.addEventListener('load', this.handleLoad)
    }
  }

  shouldComponentUpdate(nextProps: IProps, nextState) {
    return nextProps.message !== this.props.message
  }

  componentWillUnmount() {
    this._isMounted = false

    this.node.removeEventListener('load', this.handleLoad)
  }

  getContentDoc = () => this.node.contentDocument

  renderContents = () => {
    if (!this._isMounted) {
      return null
    } else {
      const content = `<!DOCTYPE html><html><head></head><body><div class="frame-root">i am a frame ${
        this.props.message
      }</div></body></html>`
      const doc = this.getContentDoc()
      doc.open('text/html', 'replace')
      doc.write(content)
      doc.close()
    }
  }

  handleLoad = () => {
    this.forceUpdate()
  }

  render() {
    this.renderContents()
    return <iframe ref={node => (this.node = node)} />
  }
}

export default Frame
