import React from 'react';

import { Summary } from './';

import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';

enum Status {
  Good = 'good',
  Skipped = 'skipped',
  Error = 'error',
  Untrusted = 'untrusted',
}

const stories = storiesOf('Custom Functions|Summary', module);

const nonCapitalizedFullName = 'SnippetName';
const funcName = 'foo';

export const basicSummaryProps: {
  items: Array<ICustomFunctionParseResult<any>>;
} = {
  items: [
    {
      nonCapitalizedFullName,
      funcName: `${funcName}1`,
      status: Status.Error,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      funcName: `${funcName}2`,
      status: Status.Skipped,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      funcName: `${funcName}3`,
      status: Status.Error,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      funcName: `${funcName}4`,
      status: Status.Skipped,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      funcName: `${funcName}5`,
      status: Status.Good,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      funcName: `${funcName}6`,
      status: Status.Good,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      funcName: `${funcName}7`,
      status: Status.Good,
      metadata: null,
    },
    {
      nonCapitalizedFullName,
      funcName: `${funcName}8`,
      status: Status.Good,
      metadata: null,
    },
  ],
};

export const BasicSummary = () => <Summary {...basicSummaryProps} />;

stories
  .addDecorator(checkA11y)
  .add('basic', () => <BasicSummary />)
  .add('all good', () => (
    <Summary
      items={basicSummaryProps.items.filter(item => item.status === Status.Good)}
    />
  ))
  .add('all bad', () => (
    <Summary
      items={basicSummaryProps.items.filter(item => item.status !== Status.Good)}
    />
  ))
  .add('loading', () => <Summary items={[]} />);
