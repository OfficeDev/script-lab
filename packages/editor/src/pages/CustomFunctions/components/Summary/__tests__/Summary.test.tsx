import React from 'react';
import { mount } from 'enzyme';

import { Summary } from '../';

enum Status {
  Good = 'good',
  Skipped = 'skipped',
  Error = 'error',
  Untrusted = 'untrusted',
}

const funcName = 'foo';
const nonCapitalizedFullName = 'SnippetName';
const basicSummaryProps: {
  items: Array<ICustomFunctionParseResult<any>>;
} = {
  items: [
    {
      nonCapitalizedFullName,
      javascriptFunctionName: `${funcName}1`,
      status: Status.Error,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      javascriptFunctionName: `${funcName}2`,
      status: Status.Skipped,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      javascriptFunctionName: `${funcName}3`,
      status: Status.Error,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      javascriptFunctionName: `${funcName}4`,
      status: Status.Skipped,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      javascriptFunctionName: `${funcName}5`,
      status: Status.Good,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      javascriptFunctionName: `${funcName}6`,
      status: Status.Good,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      javascriptFunctionName: `${funcName}7`,
      status: Status.Good,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      javascriptFunctionName: `${funcName}8`,
      status: Status.Good,
      metadata: null,
    },
  ],
};

const BasicSummary = () => <Summary {...basicSummaryProps} />;

describe('Summary should render properly in basic case', () => {
  it('should not crash', () => {
    const summary = mount(<BasicSummary />);
  });
});
