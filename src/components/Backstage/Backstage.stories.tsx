import React from 'react'

import Backstage from './index'
import GalleryList from './GalleryList'
import GalleryListItem from './GalleryList/GalleryListItem'

import { storiesOf } from '@storybook/react'
import { withNotes } from '@storybook/addon-notes'
import { checkA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import Searchbar from './Searchbar'

const stories = storiesOf('Backstage', module)

// TODO: figure out how to properly do this in storybook with knobs
const fakeHideBackstage = () => alert('hide backstage')
const fakeCreateNewSolution = () => alert('create new solution')
const fakeImportGist = (gistUrl: string) => console.log(`importing Gist ${gistUrl}`)

const fakeDisplaySearched = () => alert('you searched for something')
const fakeData = [1, 2, 3, 4, 5]

stories
  .addDecorator(checkA11y)
  .add('basic', () => (
    <Backstage
      importGist={fakeImportGist}
      createNewSolution={fakeCreateNewSolution}
      isHidden={false}
      hideBackstage={fakeHideBackstage}
    />
  ))
  .add('gallery list', () => (
    <GalleryList
      title="Example title"
      items={[
        ...Array.from({ length: 3 }, (v, n) => ({
          title: `Item ${n + 1}`,
          description: `This is the description for Item ${n + 1}.`,
        })),
        {
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
  .add('search bar', () => (
    <Searchbar data={fakeData} searchExecution={fakeDisplaySearched} />
  ))
  .add('Inaccessible', () => (
    <button style={{ backgroundColor: 'red', color: 'darkRed' }}>
      Inaccessible button
    </button>
  ))
