import React, { Component } from 'react'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { ChoiceGroup, IChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import { GistConflictResolutionOptions } from '../../interfaces/enums'

interface IGistConflictDialog {
  conflictingGist: ISharedGistMetadata
  existingSolution: ISolution
  openGist: (
    rawUrl: string,
    gistId: string,
    conflictResolution: {
      type: GistConflictResolutionOptions
      existingSolution: ISolution
    },
  ) => void
  hideBackstage: () => void
  closeDialog: () => void
}

class GistConflictDialog extends Component<IGistConflictDialog> {
  choiceGroupRef

  closeDialog = () => {
    this.props.closeDialog()
  }

  onOk = () => {
    const { openGist, conflictingGist, existingSolution } = this.props
    openGist(conflictingGist.url, conflictingGist.id, {
      type: this.choiceGroupRef.state.keyChecked,
      existingSolution,
    })
    this.closeDialog()
    this.props.hideBackstage()
  }

  setChoiceRef = (component: IChoiceGroup | null) => {
    this.choiceGroupRef = component
  }

  render() {
    return (
      <Dialog
        hidden={false}
        onDismiss={this.closeDialog}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Update Existing?',
          subText:
            'You already have a version of this gist locally. Would you like to open the existing snippet, overwrite it, or create a new copy of the gist?',
        }}
        modalProps={{
          isBlocking: true,
          containerClassName: 'ms-dialogMainOverride',
        }}
      >
        <ChoiceGroup
          options={[
            {
              key: GistConflictResolutionOptions.Open,
              text: 'Open Existing Snippet',
              checked: true,
            },
            {
              key: GistConflictResolutionOptions.Overwrite,
              text: 'Overwrite Existing Snippet',
            },
            {
              key: GistConflictResolutionOptions.CreateCopy,
              text: 'Make a New Copy',
            },
          ]}
          componentRef={this.setChoiceRef}
        />
        <DialogFooter>
          <PrimaryButton onClick={this.onOk} text="OK" />
          <DefaultButton onClick={this.closeDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    )
  }
}

export default GistConflictDialog
