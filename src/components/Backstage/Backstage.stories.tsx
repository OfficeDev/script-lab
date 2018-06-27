import React from 'react'

import Backstage from './index'
import GalleryList from './GalleryList'
import GalleryListItem from './GalleryList/GalleryListItem'

import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react'

const stories = storiesOf('Backstage', module)

// TODO: figure out how to properly do this in storybook with knobs
const fakeHideBackstage = () => alert('hide backstage')
const fakeCreateNewSolution = () => alert('create new solution')
const fakeImportGist = (gistUrl: string) => alert(`importing Gist ${gistUrl}`)
const fakeSolutions = []
const fakeOpenSolution = (solutionId: string) =>
  alert(`opening solutionId: ${solutionId}`)

stories
  .addDecorator(checkA11y)
  .add('basic', () => (
    <Backstage
      solutions={fakeSolutions}
      importGist={fakeImportGist}
      createNewSolution={fakeCreateNewSolution}
      isHidden={false}
      hideBackstage={fakeHideBackstage}
      openSolution={fakeOpenSolution}
    />
  ))
  .add('gallery list', () => (
    <GalleryList
      title="Example title"
      items={[
        ...Array.from({ length: 3 }, (v, n) => ({
          key: `${n}`,
          title: `Item ${n + 1}`,
          description: `This is the description for Item ${n + 1}.`,
        })),
        {
          key: 'asdfaqsdf',
          title: 'Selected Item',
          description: 'My purpose is to show what an active item looks like.',
          isActive: true,
        },
      ]}
    />
  ))
  .add('gallery list item', () => (
    <GalleryListItem
      title="Test Title"
      description="Test Description Test Description Test Description Test DescriptionTest Description Test Description"
    />
  ))
