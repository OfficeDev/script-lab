import React from 'react'

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'

import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'

interface ISolutionSettings {
  isOpen: boolean
  closeSolutionSettings: () => void
  solution: ISolution
  editSolutionMetadata: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => void
}

interface IState {
  name: string
  description: string
  libraries: string
}

class SolutionSettings extends React.Component<ISolutionSettings, IState> {
  state = { name: '', description: '', libraries: '' }

  setupForm = () => {
    const { solution } = this.props
    const { name, libraries } = solution
    const description = solution.description || ''
    this.setState({ name, description, libraries: libraries.join('\n') })
  }

  componentWillMount() {
    this.setupForm()
  }

  componentWillReceiveProps() {
    this.setupForm()
  }

  render() {
    const { isOpen, closeSolutionSettings } = this.props
    const { name, description, libraries } = this.state
    return (
      <Dialog
        hidden={!isOpen}
        onDismiss={closeSolutionSettings}
        dialogContentProps={{ type: DialogType.largeHeader, title: 'Info' }}
        modalProps={{ isBlocking: false }}
      >
        <TextField label="Name" onChanged={this.updateSolutionName} value={name} />
        <TextField
          label="Description"
          multiline={true}
          rows={4}
          onChanged={this.updateSolutionDescription}
          value={description}
        />
        <TextField
          label="Libraries"
          multiline={true}
          rows={6}
          onChanged={this.updateSolutionLibraries}
          value={libraries}
        />
        <DialogFooter>
          <DefaultButton
            text="Cancel"
            secondaryText="Cancels the update to snippet settings"
            onClick={closeSolutionSettings}
          />{' '}
          <PrimaryButton
            text="Update"
            secondaryText="Updates the snippet settings"
            onClick={this.updateSolutionMetadata}
          />
        </DialogFooter>
      </Dialog>
    )
  }
  private updateSolutionName = (newName: string) => this.setState({ name: newName })

  private updateSolutionDescription = (newDesc: string) =>
    this.setState({ description: newDesc })

  private updateSolutionLibraries = (newLibs: string) =>
    this.setState({ libraries: newLibs })

  private updateSolutionMetadata = () => {
    this.props.editSolutionMetadata(this.props.solution.id, {
      ...this.state,
      libraries: this.state.libraries.split('\n').filter(lib => lib),
    })
    this.props.closeSolutionSettings()
  }
}

export default SolutionSettings
