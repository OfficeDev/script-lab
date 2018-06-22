import React from 'react'

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'

import { TextField } from 'office-ui-fabric-react/lib/TextField'

import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'

interface IProps {
  isOpen: boolean
  closeSolutionSettings: () => void
  solution: ISolution
}

interface IState {
  name: string
  description: string
}

class SolutionSettings extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = { name: '', description: '' }
  }

  componentWillMount() {
    const { solution } = this.props
    const { name } = solution
    const description = solution.description || ''
    this.setState({ name, description })
  }

  render() {
    const { isOpen, closeSolutionSettings } = this.props
    const { name, description } = this.state
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

  private updateSolutionMetadata = () => {
    console.log(this.state)
    this.props.closeSolutionSettings()
  }
}

export default SolutionSettings
