import React from 'react'

import Dashboard from './'

import { storiesOf } from '@storybook/react'

const stories = storiesOf('Dashboard', module)

const Dummy = ({ letter }) => <div>I AM {letter}</div>

stories.add('basic', () => (
  <Dashboard
    items={{
      Alpha: <Dummy letter="A" />,
      Bravo: <Dummy letter="B" />,
      Charlie: <Dummy letter="C" />,
    }}
  />
))
