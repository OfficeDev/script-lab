import React from 'react'
import GalleryList from '../Backstage/GalleryList'
import Backstage from '../Backstage/index'
import WelcomePanel from './Welcome'

import { storiesOf } from '@storybook/react'
import { withNotes } from '@storybook/addon-notes'
import { checkA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'

const stories = storiesOf('CustomFunctions', module)

const fakeHideBackstage = () => alert('hide backstage')
const fakeCreateNewSolution = () => alert('create new solution')
const fakeImportGist = (gistUrl: string) => console.log(`importing Gist ${gistUrl}`)

stories.addDecorator(checkA11y).add('new basic', () => (
  // TODO: implement customfunctions pane
  <WelcomePanel />
))
