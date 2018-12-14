import React from 'react';

import SummaryItem from './SummaryItem';
import {
  CustomFunctionsDescription,
  SummaryItemsContainer,
  LoadingContainer,
} from './styles';

import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

export interface IProps {
  items: ICustomFunctionSummaryItem[] | null;
}

export const Summary = ({ items }: IProps) =>
  items === null ? (
    <LoadingContainer>
      <Spinner size={SpinnerSize.large} label="Loading..." ariaLive="assertive" />
    </LoadingContainer>
  ) : (
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

export default Summary;
