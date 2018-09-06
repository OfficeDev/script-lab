import React from 'react'

import SummaryItem from './'

import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'

enum Status {
  Good = 'good',
  Skipped = 'skipped',
  Error = 'error',
  Untrusted = 'untrusted',
}

const stories = storiesOf('CustomFunctions/Summary/Items', module)

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
        'Error - so many error messages. And this error message turns out to be a longer error message than the other ones. It is so long. A very very long error message, becauser your code is verry veryy messed up.',
      ]}
    />
    <SummaryItem status={Status.Untrusted} snippetName="SnippetName" funcName="foo4" />
  </div>
))
