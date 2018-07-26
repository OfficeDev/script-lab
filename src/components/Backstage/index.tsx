import React, { Component } from 'react'
import { BackstageWrapper } from './styles'

import Menu from './Menu'
import MySolutions from './MySolutions'
import Samples from './Samples'
import ImportSolution from './ImportSolution'

interface IBackstageItem {
  key: string
  iconName: string
  label?: string
  onSelect?: () => void
  content?: JSX.Element
}

export interface IBackstage {
  isHidden: boolean
  hideBackstage: () => void
  solutions: ISolution[]
  activeSolution?: ISolution

  samplesMetadataByGroup: ISampleMetadata[]

  // from redux
  createNewSolution: () => void
  openSolution: (solutionId: string) => void
  openSample: (rawUrl: string) => void
  importGist: (gistId?: string, gist?: string) => void
}

interface IState {
  selectedKey: string
}

// TODO: figure out how this data will be fetched and piped through
export default class Backstage extends Component<IBackstage, IState> {
  state = {
    selectedKey: 'my-solutions',
  }

  constructor(props) {
    super(props)
  }

  openSolution = (solutionId: string) => {
    this.props.openSolution(solutionId)
    this.props.hideBackstage()
  }

  openSample = (rawUrl: string) => {
    this.props.openSample(rawUrl)
    this.props.hideBackstage()
    this.setState({ selectedKey: 'my-solutions' })
  }

  render() {
    const items = [
      {
        key: 'back',
        iconName: 'GlobalNavButton',
        onSelect: this.props.hideBackstage,
      },
      {
        key: 'new',
        label: 'New Snippet',
        iconName: 'Add',
        onSelect: () => {
          this.props.createNewSolution()
          this.props.hideBackstage()
        },
      },
      {
        key: 'my-solutions',
        label: 'My Snippets',
        iconName: 'DocumentSet',
        content: (
          <MySolutions
            solutions={this.props.solutions}
            openSolution={this.openSolution}
            activeSolution={this.props.activeSolution}
          />
        ),
      },
      {
        key: 'samples',
        label: 'Samples',
        iconName: 'Dictionary',
        content: (
          <Samples
            samplesMetadataByGroup={this.props.samplesMetadataByGroup}
            openSample={this.openSample}
          />
        ),
      },
      {
        key: 'import',
        label: 'Import',
        iconName: 'Download',
        content: (
          <ImportSolution
            importGist={this.props.importGist}
            hideBackstage={this.props.hideBackstage}
          />
        ),
      },
    ].map((item: IBackstageItem) => ({
      onSelect: () => this.setState({ selectedKey: item.key }),
      ...item,
    }))
    const { selectedKey } = this.state
    const activeItem = items.find(item => item.key === selectedKey)
    return (
      <BackstageWrapper style={{ display: this.props.isHidden ? 'none' : 'flex' }}>
        <Menu
          selectedKey={this.state.selectedKey}
          items={items.map(item => ({
            key: item.key,
            label: item.label,
            icon: item.iconName,
            onClick: item.onSelect,
          }))}
        />
        {activeItem && activeItem.content}
      </BackstageWrapper>
    )
  }
}
