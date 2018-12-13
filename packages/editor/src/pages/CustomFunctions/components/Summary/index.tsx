import React from 'react';

import SummaryItem from './SummaryItem';
import {
  CustomFunctionsDescription,
  SummaryItemsContainer,
  LoadingContainer,
} from './styles';

import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { connect } from 'react-redux';
import { IState as IReduxState } from '../../../../store/reducer';
import selectors from '../../../../store/selectors';

interface IPropsFromRedux {
  items: ICustomFunctionSummaryItem[];
  isLoading: boolean;
}

const mapStateToProps = (state: IReduxState): IPropsFromRedux => ({
  items: selectors.customFunctions.getMetadataSummaryItems(state),
  isLoading: state.customFunctions.isFetchingMetadata,
});

export interface IProps extends IPropsFromRedux {}

export const Summary = ({ items, isLoading }: IProps) => {
  const hasErrors = items.filter(item => item.status === 'error').length > 0;

  const description = hasErrors
    ? 'Some of your functions are invalid and cannot be declared. Review and fix the issues.'
    : 'The following functions have been registered successfully.';

  return isLoading ? (
    <LoadingContainer>
      <Spinner size={SpinnerSize.large} label="Loading..." ariaLive="assertive" />
    </LoadingContainer>
  ) : (
    <div>
      <CustomFunctionsDescription>{description}</CustomFunctionsDescription>
      <SummaryItemsContainer>
        {items.map(item => (
          <SummaryItem key={`${item.snippetName}${item.funcName}`} {...item} />
        ))}
      </SummaryItemsContainer>
    </div>
  );
};

export default connect(mapStateToProps)(Summary);
