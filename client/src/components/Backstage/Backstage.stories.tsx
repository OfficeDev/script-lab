import React from 'react'

import { Backstage, IProps } from './'

import { exampleSolutions, exampleGistMetadata } from './MySolutions/MySolutions.stories'
import { exampleSamples } from './Samples/Samples.stories'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

const defaultBackstageProps: IProps = {
  activeSolution: exampleSolutions[2],
  sharedGistMetadata: exampleGistMetadata,
  samplesByGroup: exampleSamples,
  solutions: exampleSolutions,
  createNewSolution: action('create-new-solution'),
  goBack: action('go-back'),
  importGist: action('import-gist'),
  openGist: action('open-gist'),
  openSample: action('open-sample'),
  openSolution: action('open-solution'),
}

storiesOf('Backstage', module).add('basic', () => (
  <Backstage {...defaultBackstageProps} />
))
