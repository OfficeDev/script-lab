import React, { Component } from 'react'
import { BackstageWrapper } from './styles'

import Menu from './Menu'
import MySolutions from './MySolutions'
import Samples from './Samples'
import ImportSolution from './ImportSolution'

import ConflictResolutionDialog from './ConflictResolutionDialog'

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

  // from redux
  samplesMetadataByGroup: ISampleMetadata[]
  sharedGistMetadata: ISharedGistMetadata[]

  createNewSolution: () => void
  openSolution: (solutionId: string) => void
  openSample: (rawUrl: string) => void
  openGist: (rawUrl: string, gistId: string, conflictResolution?: any) => void
  importGist: (gistId?: string, gist?: string) => void
}

interface IState {
  selectedKey: string
  conflictingGist: ISharedGistMetadata | null
  existingSolutionsConflicting: ISolution[] | null
}

export default class Backstage extends Component<IBackstage, IState> {
  state = {
    selectedKey: 'my-solutions',
    conflictingGist: null,
    existingSolutionsConflicting: null,
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

  openSharedGist = (gistMeta: ISharedGistMetadata) => {
    const { solutions, openGist, hideBackstage } = this.props
    const { id, url } = gistMeta
    const existingSolutions = solutions.filter(s => s.gistId === id)
    if (existingSolutions) {
      // version of this gist already exists locally in solutions
      this.showGistConflictDialog(gistMeta, existingSolutions)
    } else {
      openGist(url, id)
      hideBackstage()
    }
  }

  showGistConflictDialog = (
    conflictingGist: ISharedGistMetadata,
    existingSolutionsConflicting: ISolution[],
  ) => this.setState({ conflictingGist, existingSolutionsConflicting })

  hideGistConflictDialog = () =>
    this.setState({ conflictingGist: null, existingSolutionsConflicting: null })

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
            gistMetadata={this.props.sharedGistMetadata}
            openGist={this.openSharedGist}
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
    const { selectedKey, conflictingGist, existingSolutionsConflicting } = this.state
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
        {conflictingGist &&
          existingSolutionsConflicting && (
            <ConflictResolutionDialog
              conflictingGist={conflictingGist}
              existingSolutions={existingSolutionsConflicting}
              closeDialog={this.hideGistConflictDialog}
              hideBackstage={this.props.hideBackstage}
              openGist={this.props.openGist}
            />
          )}
      </BackstageWrapper>
    )
  }
}
