import React from 'react'

import ImportSolution from './'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

storiesOf('Backstage|ImportSolution', module).add('basic', () => (
  <ImportSolution importGist={action('import-gist')} />
))
