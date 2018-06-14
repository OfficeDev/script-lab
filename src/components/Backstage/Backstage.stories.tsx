import React from 'react'
import styled from 'styled-components'

import Backstage from './index'
import GalleryList from './GalleryList'
import GalleryListItem from './GalleryList/GalleryListItem'

import { storiesOf } from '@storybook/react'

const stories = storiesOf('Backstage', module)

stories
  .add('basic', () => <Backstage />)
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
