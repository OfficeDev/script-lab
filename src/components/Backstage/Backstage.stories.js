import React from 'react'
import styled from 'styled-components'

import Backstage from './index'
import GalleryList from './GalleryList'
import GalleryListItem from './GalleryList/GalleryListItem';

import { storiesOf } from '@storybook/react'

const stories = storiesOf('Backstage', module)

stories.add('basic', () => <Backstage />)
stories.add('gallery list', () => (
  <GalleryList
    title="Example title"
    items={new Array(3).map(n => ({
      title: `Item ${n + 1}`,
      description: `This is the description for Item ${n + 1}.`,
    }))}
  />
))
stories.add('gallery list item', () => <GalleryListItem title="Test Title" description="Test Description Test Description Test Description Test DescriptionTest Description Test Description" />)
