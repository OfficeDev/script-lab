import React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

import { FunctionList, FunctionName, FunctionWrapper } from './styles';

export interface IProps {
  functions: IDirectScriptExecutionFunctionMetadata[];
}

export class SnippetFunctionGallery extends React.Component<IProps> {
  render() {
    const { functions } = this.props;
    return (
      <FunctionList>
        {functions.map(({ name }) => (
          <FunctionWrapper key={name}>
            <IconButton iconProps={{ iconName: 'Play' }} style={{ color: 'green' }} />
            <FunctionName>{name}</FunctionName>
          </FunctionWrapper>
        ))}
      </FunctionList>
    );
  }
}

export default SnippetFunctionGallery;
