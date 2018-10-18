import React from 'react'

import Only from '../../Only'

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Link } from 'office-ui-fabric-react/lib/Link'

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
}

class SolutionSettings extends React.Component<ISolutionSettings, IState> {
  state = { name: '', description: '' }

  setupForm = () => {
    const { solution } = this.props
    const { name } = solution
    const description = solution.description || ''
    this.setState({ name, description })
  }

  componentWillMount() {
    this.setupForm()
  }

  componentWillReceiveProps() {
    this.setupForm()
  }

  render() {
    const { solution, isOpen, closeSolutionSettings } = this.props
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
        <Only when={solution.source && solution.source.origin === 'gist'}>
          <Label>Gist URL</Label>
          <Link
            target="_blank"
            href={solution.source && `https://gist.github.com/${solution.source.id}`}
          >
            Open in browser
          </Link>
        </Only>
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
    this.props.editSolutionMetadata(this.props.solution.id, this.state)
    this.props.closeSolutionSettings()
  }
}

export default SolutionSettings
