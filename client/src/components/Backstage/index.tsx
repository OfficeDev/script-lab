import React, { Component } from 'react'
import { withTheme } from 'styled-components'
import { BackstageWrapper } from './styles'

import Menu from './Menu'
import MySolutions from './MySolutions'
import Samples from './Samples'
import ImportSolution from './ImportSolution'

import ConflictResolutionDialog from './ConflictResolutionDialog/ConflictResolutionDialog'
import { ConflictResolutionOptions } from '../../interfaces/enums'

import { connect } from 'react-redux'
import selectors from '../../store/selectors'
import { editor, solutions, samples, gists } from '../../store/actions'
import { goBack } from 'connected-react-router'

interface IBackstageItem {
  key: string
  iconName: string
  label?: string
  onSelect?: () => void
  content?: JSX.Element
}

interface IPropsFromRedux {
  solutions: ISolution[]
  activeSolution?: ISolution
  sharedGistMetadata: ISharedGistMetadata[]
  samplesByGroup: { [group: string]: ISampleMetadata[] }
}

const mapStateToProps = (state): IPropsFromRedux => ({
  solutions: selectors.solutions.getAll(state),
  activeSolution: selectors.editor.getActiveSolution(state),
  sharedGistMetadata: selectors.gists.getGistMetadata(state),
  samplesByGroup: selectors.samples.getMetadataByGroup(state),
})

interface IActionsFromRedux {
  createNewSolution: () => void
  openSolution: (solutionId: string, fileId: string) => void
  openSample: (rawUrl: string) => void
  openGist: (
    rawUrl: string,
    gistId: string,
    conflictResolution?: { type: ConflictResolutionOptions; existingSolution: ISolution },
  ) => void
  importGist: (gistId?: string, gist?: string) => void
  goBack: () => void
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  createNewSolution: () => dispatch(solutions.create()),
  openSolution: (solutionId: string, fileId: string) =>
    dispatch(editor.open({ solutionId, fileId })),
  openSample: (rawUrl: string) => dispatch(samples.get.request({ rawUrl })),
  openGist: (
    rawUrl: string,
    gistId: string,
    conflictResolution?: { type: ConflictResolutionOptions; existingSolution: ISolution },
  ) => dispatch(gists.get.request({ rawUrl, gistId, conflictResolution })),
  importGist: (gistId?: string, gist?: string) =>
    dispatch(gists.importSnippet.request({ gistId, gist })),
  goBack: () => dispatch(goBack()),
})

export interface IBackstage extends IPropsFromRedux, IActionsFromRedux {
  theme: ITheme // from withTheme
}

interface IState {
  selectedKey: string
  conflictingGist: ISharedGistMetadata | null
  existingSolutionsConflicting: ISolution[] | null
}

class Backstage extends Component<IBackstage, IState> {
  state = {
    selectedKey: 'my-solutions',
    conflictingGist: null,
    existingSolutionsConflicting: null,
  }

  openSolution = (solutionId: string) => {
    const solution = this.props.solutions.find(solution => solution.id === solutionId)
    this.props.openSolution(solutionId, solution!.files[0].id)
  }

  openSample = (rawUrl: string) => {
    this.props.openSample(rawUrl)
    this.setState({ selectedKey: 'my-solutions' })
  }

  openSharedGist = (gistMeta: ISharedGistMetadata) => {
    const { solutions, openGist } = this.props
    const { id, url } = gistMeta
    const existingSolutions = solutions.filter(
      s => s.source && s.source.origin === 'gist' && s.source.id === id,
    )

    if (existingSolutions.length > 0) {
      // version of this gist already exists locally in solutions
      this.showGistConflictDialog(gistMeta, existingSolutions)
    } else {
      openGist(url, id)
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
        onSelect: this.props.goBack,
      },
      {
        key: 'new',
        label: 'New Snippet',
        iconName: 'Add',
        onSelect: () => {
          this.props.createNewSolution()
        },
      },
      {
        key: 'my-solutions',
        label: 'My Snippets',
        iconName: 'DocumentSet',
        content: (
          <MySolutions
            theme={this.props.theme}
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
            theme={this.props.theme}
            openSample={this.openSample}
            samplesByGroup={this.props.samplesByGroup}
          />
        ),
      },
      {
        key: 'import',
        label: 'Import',
        iconName: 'Download',
        content: <ImportSolution importGist={this.props.importGist} />,
      },
    ].map((item: IBackstageItem) => ({
      onSelect: () => this.setState({ selectedKey: item.key }),
      ...item,
    }))
    const { selectedKey, conflictingGist, existingSolutionsConflicting } = this.state
    const activeItem = items.find(item => item.key === selectedKey)
    return (
      <BackstageWrapper>
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
              openGist={this.props.openGist}
            />
          )}
      </BackstageWrapper>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(Backstage))
