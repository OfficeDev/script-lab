import React from 'react'

import ImportSolution from './'

import { storiesOf } from '@storybook/react'

const voidFunc = () => {}

storiesOf('Backstage/ImportSolution', module).add('basic', () => (
  <ImportSolution importGist={voidFunc} />
))
