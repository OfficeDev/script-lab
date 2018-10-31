import React from 'react'
import styled from 'styled-components'

import Only from '../../Only'

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Label } from 'office-ui-fabric-react/lib/Label'
import { Link } from 'office-ui-fabric-react/lib/Link'

const DialogBodyWrapper = styled.div`
  & > * {
    margin-bottom: 1.5rem;
  }
`

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
  isDefaultRunSolution?: boolean
}

class SolutionSettings extends React.Component<ISolutionSettings, IState> {
  state = { name: '', description: '', isDefaultRunSolution: undefined }

  setupForm = () => {
    const { solution } = this.props
    const { name } = solution
    const description = solution.description || ''
    const isDefaultRunSolution = solution.isDefaultRunSolution
    this.setState({ name, description, isDefaultRunSolution })
  }

  componentWillMount() {
    this.setupForm()
  }

  componentWillReceiveProps() {
    this.setupForm()
  }

  render() {
    const { solution, isOpen, closeSolutionSettings } = this.props
    const { name, description, isDefaultRunSolution } = this.state
    return (
      <Dialog
        hidden={!isOpen}
        onDismiss={closeSolutionSettings}
        dialogContentProps={{ type: DialogType.largeHeader, title: 'Info' }}
        modalProps={{ isBlocking: false }}
      >
        <DialogBodyWrapper>
          <TextField label="Name" onChange={this.updateSolutionName} value={name} />
          <TextField
            label="Description"
            multiline={true}
            rows={4}
            onChange={this.updateSolutionDescription}
            value={description}
          />
          <Checkbox
            label="No Custom UI"
            checked={isDefaultRunSolution || false}
            onChange={this.updateSolutionNoCustomUI}
          />
          <Only when={solution.source && solution.source.origin === 'gist'}>
            <div>
              <Label>Gist URL</Label>
              <Link
                target="_blank"
                href={solution.source && `https://gist.github.com/${solution.source.id}`}
              >
                Open in browser
              </Link>
            </div>
          </Only>
        </DialogBodyWrapper>
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
  private updateSolutionName = (
    nevent: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined,
  ) => this.setState({ name: newValue! })

  private updateSolutionDescription = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined,
  ) => this.setState({ description: newValue! })

  private updateSolutionNoCustomUI = (
    event: React.FormEvent<HTMLElement>,
    isChecked: boolean,
  ) => {
    if (isChecked) {
      this.setState({ isDefaultRunSolution: true })
    } else {
      this.setState({ isDefaultRunSolution: undefined })
    }
  }

  private updateSolutionMetadata = () => {
    this.props.editSolutionMetadata(this.props.solution.id, this.state)
    this.props.closeSolutionSettings()
  }
}

export default SolutionSettings
