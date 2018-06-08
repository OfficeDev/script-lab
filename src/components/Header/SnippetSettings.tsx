import React from 'react';
import styled from 'styled-components';
import { ISnippet, ISnippetMetadata } from '../../interfaces';

import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';

import { TextField } from 'office-ui-fabric-react/lib/TextField';

import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';

interface IProps {
  isOpen: boolean;
  closeSnippetSettings: () => void;
  snippet: ISnippet;
}

interface IState {
  name: string;
  description: string;
}

class SnippetSettings extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = { name: '', description: '' };
  }

  componentWillMount() {
    // this.setState({
    //   name: this.props.snippet.metadata.name,
    //   description: this.props.snippet.metadata.description || '',
    // })
  }

  render() {
    const { isOpen, closeSnippetSettings } = this.props;
    const { name, description } = this.state;
    return (
      <Dialog
        hidden={!isOpen}
        onDismiss={closeSnippetSettings}
        dialogContentProps={{ type: DialogType.largeHeader, title: 'Info' }}
        modalProps={{ isBlocking: false }}
      >
        <TextField label="Name" onChanged={this.updateSnippetName} value={name} />
        <TextField
          label="Description"
          multiline={true}
          rows={4}
          onChanged={this.updateSnippetDescription}
          value={description}
        />
        <DialogFooter>
          <DefaultButton
            text="Cancel"
            secondaryText="Cancels the update to snippet settings"
            onClick={closeSnippetSettings}
          />{' '}
          <PrimaryButton
            text="Update"
            secondaryText="Updates the snippet settings"
            onClick={this.updateSnippetMetadata}
          />
        </DialogFooter>
      </Dialog>
    );
  }
  private updateSnippetName = (newName: string) => this.setState({ name: newName });

  private updateSnippetDescription = (newDesc: string) =>
    this.setState({ description: newDesc });

  private updateSnippetMetadata = () => {
    console.log(this.state);
    this.props.closeSnippetSettings();
  };
}

export default SnippetSettings;
