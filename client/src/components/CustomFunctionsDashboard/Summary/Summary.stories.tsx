import React from 'react'

import { Summary } from './'

import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'

import { Layout, Content } from '../Dashboard/styles'

enum Status {
  Good = 'good',
  Skipped = 'skipped',
  Error = 'error',
  Untrusted = 'untrusted',
}

const stories = storiesOf('Custom Functions|Summary', module)

const containerWrapper = storyFn => (
  <Layout>
    <Content>{storyFn()}</Content>
  </Layout>
)

stories.addDecorator(containerWrapper)

const snippetName = 'SnippetName'
const funcName = 'foo'

export const basicSummaryProps = {
  items: [
    { snippetName, funcName: `${funcName}1`, status: Status.Error },
    { snippetName, funcName: `${funcName}2`, status: Status.Skipped },
    { snippetName, funcName: `${funcName}3`, status: Status.Error },
    { snippetName, funcName: `${funcName}4`, status: Status.Skipped },
    { snippetName, funcName: `${funcName}5`, status: Status.Good },
    { snippetName, funcName: `${funcName}6`, status: Status.Good },
    { snippetName, funcName: `${funcName}7`, status: Status.Good },
    { snippetName, funcName: `${funcName}8`, status: Status.Good },
  ],
}

export const BasicSummary = () => <Summary {...basicSummaryProps} isLoading={false} />

stories
  .addDecorator(checkA11y)
  .add('basic', () => <BasicSummary />)
  .add('all good', () => (
    <Summary
      items={basicSummaryProps.items.filter(item => item.status === Status.Good)}
      isLoading={false}
    />
  ))
  .add('all bad', () => (
    <Summary
      items={basicSummaryProps.items.filter(item => item.status !== Status.Good)}
      isLoading={false}
    />
  ))
  .add('loading', () => <Summary items={[]} isLoading={true} />)
