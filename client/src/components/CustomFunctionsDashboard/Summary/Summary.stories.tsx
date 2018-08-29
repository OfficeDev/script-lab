import React from 'react'

import { Summary } from './'
import SummaryItem from './SummaryItem'

import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'

import { Layout, Content } from '../Dashboard/styles'

enum Status {
  Good = 'good',
  Skipped = 'skipped',
  Error = 'error',
  Untrusted = 'untrusted',
}

const stories = storiesOf('Summary', module)

const containerWrapper = storyFn => (
  <Layout>
    <Content>{storyFn()}</Content>
  </Layout>
)

stories.addDecorator(containerWrapper)

const snippetName = 'SnippetName'
const funcName = 'foo'

export const BasicSummary = () => (
  <Summary
    items={[
      { snippetName, funcName, status: Status.Error },
      { snippetName, funcName, status: Status.Skipped },
      { snippetName, funcName, status: Status.Error },
      { snippetName, funcName, status: Status.Skipped },
      { snippetName, funcName, status: Status.Good },
      { snippetName, funcName, status: Status.Good },
      { snippetName, funcName, status: Status.Good },
      { snippetName, funcName, status: Status.Good },
    ]}
  />
)

stories
  .addDecorator(checkA11y)
  .add('basic', () => <BasicSummary />)
  .add('all good', () => {
    const snippetName = 'SnippetName'
    const funcName = 'foo'
    return (
      <Summary
        items={[
          { snippetName, funcName, status: Status.Good },
          { snippetName, funcName, status: Status.Good },
          { snippetName, funcName, status: Status.Good },
          { snippetName, funcName, status: Status.Good },
        ]}
      />
    )
  })
  .add('all bad', () => {
    const snippetName = 'SnippetName'
    const funcName = 'foo'
    return (
      <Summary
        items={[
          { snippetName, funcName, status: Status.Good },
          { snippetName, funcName, status: Status.Good },
          { snippetName, funcName, status: Status.Good },
          { snippetName, funcName, status: Status.Good },
        ]}
      />
    )
  })
  .add('summary items', () => (
    <div>
      <SummaryItem status={Status.Good} snippetName="SnippetName" funcName="foo" />
      <SummaryItem status={Status.Skipped} snippetName="SnippetName" funcName="foo" />
      <SummaryItem
        status={Status.Error}
        snippetName="SnippetName"
        funcName="foo"
        additionalInfo={[
          'Error - I am an error message. Be scared of me .',
          'Error - so many error messages. And this error message turns out to be a longer error message than the other ones. It is so long. A very very long error message, becauser your code is verry veryy messed up.',
        ]}
      />
      <SummaryItem status={Status.Untrusted} snippetName="SnippetName" funcName="foo" />
    </div>
  ))
