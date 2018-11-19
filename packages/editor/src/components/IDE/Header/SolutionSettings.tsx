import React from 'react';
import styled from 'styled-components';

import Only from '../../Only';

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Link } from 'office-ui-fabric-react/lib/Link';

const DialogBodyWrapper = styled.div`
  & > * {
    margin-bottom: 1.5rem;
  }
`;

interface ISolutionSettings {
  isOpen: boolean;
  closeSolutionSettings: () => void;
  solution: ISolution;
  editSolutionMetadata: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => void;
}

interface IState {
  name: string;
  description: string;
  isDirectScriptExecutionSolution?: boolean;
}

class SolutionSettings extends React.Component<ISolutionSettings, IState> {
  state = { name: '', description: '', isDirectScriptExecutionSolution: undefined };

  setupForm = () => {
    const { solution } = this.props;
    const { name } = solution;
    const description = solution.description || '';
    const isDirectScriptExecutionSolution = solution.options.isDirectScriptExecution;
    this.setState({ name, description, isDirectScriptExecutionSolution });
  };

  componentWillMount() {
    this.setupForm();
  }

  componentWillReceiveProps() {
    this.setupForm();
  }

  render() {
    const { solution, isOpen, closeSolutionSettings } = this.props;
    const { name, description, isDirectScriptExecutionSolution } = this.state;
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
            checked={isDirectScriptExecutionSolution || false}
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
    );
  }
  private updateSolutionName = (
    nevent: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined,
  ) => this.setState({ name: newValue! });

  private updateSolutionDescription = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined,
  ) => this.setState({ description: newValue! });

  private updateSolutionNoCustomUI = (
    event: React.FormEvent<HTMLElement>,
    isChecked: boolean,
  ) => {
    if (isChecked) {
      this.setState({ isDirectScriptExecutionSolution: true });
    } else {
      this.setState({ isDirectScriptExecutionSolution: undefined });
    }
  };

  private updateSolutionMetadata = () => {
    const { name, description, isDirectScriptExecutionSolution } = this.state;
    this.props.editSolutionMetadata(this.props.solution.id, {
      name,
      description,
      options: {
        ...this.props.solution.options,
        isDirectScriptExecution: isDirectScriptExecutionSolution,
      },
    });
    this.props.closeSolutionSettings();
  };
}

export default SolutionSettings;
