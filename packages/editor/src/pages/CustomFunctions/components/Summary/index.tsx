import React from 'react';

import SummaryItem from './SummaryItem';
import {
  CustomFunctionsDescription,
  SummaryItemsContainer,
  LoadingContainer,
} from './styles';

import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { invokeGlobalErrorHandler } from 'common/lib/utilities/splash.screen';

export interface IProps {
  items: ICustomFunctionSummaryItem[] | null;
  error?: Error;
}

export class Summary extends React.Component<IProps, {}> {
  render() {
    const { error, items } = this.props;

    if (error) {
      return (
        <MessageBar
          messageBarType={MessageBarType.severeWarning}
          isMultiline={true}
          actions={
            <div>
              <DefaultButton primary={true} onClick={this.moreErrorInfo}>
                More info
              </DefaultButton>
            </div>
          }
        >
          An error occurred while registering your custom functions.
        </MessageBar>
      );
    }

    if (!items) {
      return (
        <LoadingContainer>
          <Spinner size={SpinnerSize.large} label="Loading..." ariaLive="assertive" />
        </LoadingContainer>
      );
    }

    return (
      <div>
        <CustomFunctionsDescription>
          {items.filter(item => item.status === 'error').length > 0
            ? 'Some of your functions are invalid and cannot be declared. Review and fix the issues.'
            : 'The following functions have been registered successfully.'}
        </CustomFunctionsDescription>
        <SummaryItemsContainer>
          {items.map(item => (
            <SummaryItem key={`${item.snippetName}${item.funcName}`} {...item} />
          ))}
        </SummaryItemsContainer>
      </div>
    );
  }

  moreErrorInfo = () => {
    invokeGlobalErrorHandler(this.props.error, { showExpanded: true });
  };
}

export default Summary;
