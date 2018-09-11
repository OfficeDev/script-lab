import React from 'react'

import GalleryList from './'

import { getBasicGalleryListItemProps } from './GalleryListItem/GalleryListItem.stories'

import { storiesOf } from '@storybook/react'

export const BasicGalleryList = () => (
  <GalleryList
    title="Example Title"
    items={Array.from({ length: 5 }, (v, k) => getBasicGalleryListItemProps(k))}
  />
)

export const GalleryListWithActive = () => (
  <GalleryList
    title="Example Title"
    items={Array.from({ length: 3 }, (v, k) => ({
      ...getBasicGalleryListItemProps(k),
      ...(k === 2 ? { isActive: true } : {}),
    }))}
  />
)

storiesOf('Backstage|GalleryList', module)
  .add('basic', () => <BasicGalleryList />)
  .add('with an active', () => <GalleryListWithActive />)
  .add('multiple', () => (
    <div>
      <BasicGalleryList />
      <BasicGalleryList />
      <BasicGalleryList />
      <BasicGalleryList />
      <BasicGalleryList />
    </div>
  ))
