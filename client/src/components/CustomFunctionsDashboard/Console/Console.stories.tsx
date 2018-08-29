import React from 'react'

import { Console, ConsoleLogTypes } from './'

import { storiesOf } from '@storybook/react'

import { Layout, Content } from '../Dashboard/styles'

const stories = storiesOf('Console', module)

const containerWrapper = storyFn => (
  <Layout>
    <Content>{storyFn()}</Content>
  </Layout>
)

stories.addDecorator(containerWrapper)

const sampleSource1 = 'IAmSomeSource'
const sampleSource2 = 'IAmSomeOtherSource'

const getSampleMessage = (x: string | number) =>
  `I am a sample log ${x} log ${x} log log. I am such a log.`

const sampleLogs = [
  {
    source: sampleSource1,
    message: getSampleMessage(1),
    severity: ConsoleLogTypes.Info,
  },
  {
    source: sampleSource1,
    message: getSampleMessage('info'),
    severity: ConsoleLogTypes.Info,
  },
  {
    source: sampleSource1,
    message: getSampleMessage('log'),
    severity: ConsoleLogTypes.Log,
  },
  {
    source: sampleSource2,
    message: getSampleMessage('warn'),
    severity: ConsoleLogTypes.Warn,
  },
  {
    source: sampleSource2,
    message: getSampleMessage('error'),
    severity: ConsoleLogTypes.Error,
  },
]

const voidFunc = () => {}

export const BasicConsole = () => (
  <Console
    logs={sampleLogs}
    engineStatus={{
      enabled: true,
      nativeRuntime: false,
    }}
    runnerIsAlive={true}
    runnerLastUpdated={Date.now()}
    fetchLogs={voidFunc}
    clearLogs={voidFunc}
  />
)

stories.add('basic', () => <BasicConsole />)
