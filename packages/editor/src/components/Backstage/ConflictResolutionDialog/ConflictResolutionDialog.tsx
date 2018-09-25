import React, { Component } from 'react'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import {
  ChoiceGroup,
  IChoiceGroup,
  IChoiceGroupOption,
} from 'office-ui-fabric-react/lib/ChoiceGroup'
import {
  Dropdown,
  IDropdown,
  DropdownMenuItemType,
  IDropdownOption,
} from 'office-ui-fabric-react/lib/Dropdown'

import { ConflictResolutionOptions } from '../../../interfaces/enums'

interface IGistConflictDialog {
  conflictingGist: ISharedGistMetadata
  existingSolutions: ISolution[]
  openGist: (
    rawUrl: string,
    gistId: string,
    conflictResolution: {
      type: ConflictResolutionOptions
      existingSolution: ISolution
    },
  ) => void
  closeDialog: () => void
}

interface IState {
  selectedChoiceOption: string
  isDropdownDisabled: boolean
}

const initialState = {
  selectedChoiceOption: ConflictResolutionOptions.CreateCopy,
  isDropdownDisabled: true,
}

class ConflictResolutionDialog extends Component<IGistConflictDialog, IState> {
  dropdownRef
  state = initialState

  closeDialog = () => {
    this.props.closeDialog()
    this.setState(initialState)
  }

  onOk = () => {
    const { openGist, conflictingGist, existingSolutions } = this.props

    const existingSolution =
      existingSolutions.length > 1
        ? existingSolutions[this.dropdownRef.state.selectedIndices[0]]
        : existingSolutions[0]

    openGist(conflictingGist.url, conflictingGist.id, {
      type: this.state.selectedChoiceOption,
      existingSolution,
    })

    this.closeDialog()
  }

  setDropdownRef = (component: IDropdown | null) => {
    this.dropdownRef = component
  }

  onChoiceChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    option?: IChoiceGroupOption,
  ) => {
    if (option) {
      this.setState({ selectedChoiceOption: option.key })

      if (
        option.key === ConflictResolutionOptions.Open ||
        option.key === ConflictResolutionOptions.Overwrite
      ) {
        this.setState({ isDropdownDisabled: false })
      } else {
        this.setState({ isDropdownDisabled: true })
      }
    }
  }

  render() {
    const { selectedChoiceOption, isDropdownDisabled } = this.state
    const { existingSolutions } = this.props
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
              key: ConflictResolutionOptions.CreateCopy,
              text: 'Make a New Copy',
            },
            {
              key: ConflictResolutionOptions.Open,
              text: 'Open Existing Snippet',
            },
            {
              key: ConflictResolutionOptions.Overwrite,
              text: 'Overwrite Existing Snippet',
            },
          ]}
          selectedKey={selectedChoiceOption}
          onChange={this.onChoiceChange}
        />
        {existingSolutions.length > 1 && (
          <div
            style={{
              marginTop: '1.2rem',
            }}
          >
            <Dropdown
              disabled={isDropdownDisabled}
              label="Select Existing Snippet:"
              id="select-solution"
              ariaLabel="Snippet Selector"
              options={existingSolutions.map(sol => ({
                key: sol.id,
                text: sol.name,
                title: sol.description,
              }))}
              defaultSelectedKey={existingSolutions[0].id}
              componentRef={this.setDropdownRef}
            />
          </div>
        )}
        <DialogFooter>
          <PrimaryButton onClick={this.onOk} text="OK" />
          <DefaultButton onClick={this.closeDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    )
  }
}

export default ConflictResolutionDialog
