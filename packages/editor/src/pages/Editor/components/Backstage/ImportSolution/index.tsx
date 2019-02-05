import React, { Component } from 'react';
import Content from '../Content';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

import YAML from 'js-yaml';
import { convertSnippetToSolution } from '../../../../../utils';

interface IProps {
  importGist: (gistId?: string, gist?: string) => void;
}

interface IState {
  importFieldText: string;
  errorMessage: string | undefined;
}

class ImportSolution extends Component<IProps, IState> {
  state = { importFieldText: '', errorMessage: undefined };

  render() {
    return (
      <Content
        title="Import snippet"
        description="Enter the snippet's URL or paste the YAML below, then choose Import."
      >
        <span className="ms-font-m">Snippet URL or YAML</span>
        <TextField
          multiline={true}
          rows={8}
          onChange={this.updateImportFieldText}
          placeholder="e.g.: https://gist.github.com/sampleGistId"
          errorMessage={this.state.errorMessage}
        />
        <PrimaryButton
          style={{ marginTop: '1.5rem', float: 'right' }}
          text="Import"
          onClick={this.onImportClick}
        />
      </Content>
    );
  }

  private updateImportFieldText = (event: any, newValue?: string | undefined) =>
    this.setState({ importFieldText: newValue || '' });

  private onImportClick = () => {
    const input = this.state.importFieldText.trim();
    let gistId;
    let gist;
    try {
      if (input.startsWith('https://gist.github.com/')) {
        gistId = input.split('/').pop();
      } else {
        gist = input;
        const content = YAML.safeLoad(input);
        const { name, host } = convertSnippetToSolution(content);
        if (!name && !host) {
          throw new Error();
        }
      }

      this.props.importGist(gistId, gist);
      this.setState({ importFieldText: '', errorMessage: undefined });
    } catch (err) {
      this.setState({
        errorMessage: 'You must provide valid gist YAML or a valid gist url.',
      });
    }
  };
}

export default ImportSolution;
