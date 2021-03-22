import React from 'react';

import SummaryItem from './';

import { storiesOf } from '@storybook/react';

enum Status {
  Good = 'good',
  Skipped = 'skipped',
  Error = 'error',
  Untrusted = 'untrusted',
}

const stories = storiesOf('Custom Functions|Summary/Items', module);

stories.add('basic', () => (
  <div>
    <SummaryItem status={Status.Good} snippetName="SnippetName" funcName="foo1" />
    <SummaryItem status={Status.Skipped} snippetName="SnippetName" funcName="foo2" />
    <SummaryItem
      status={Status.Error}
      snippetName="SnippetName"
      funcName="foo3"
      additionalInfo={[
        'Error - I am an error message. Be scared of me .',
        'Error - so many error messages. And this error message turns out to be a longer error message than the other ones. It is so long. A very very long error message. Like, super-duper long. And even longer.',
      ]}
    />
    <SummaryItem status={Status.Untrusted} snippetName="SnippetName" funcName="foo4" />
  </div>
));
