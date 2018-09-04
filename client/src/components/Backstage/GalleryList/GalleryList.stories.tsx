import React from 'react'

import GalleryList from './'

import {getBasicGalleryListItemProps} from './GalleryListItem/GalleryListItem.stories'

import { storiesOf } from '@storybook/react'

export const BasicGalleryList = () => <GalleryList title='Example Title' items={Array.from({ length: 5 }, (v, k) =>  getBasicGalleryListItemProps(k))} />

storiesOf('Backstage/GalleryList', module).add('basic', () => <BasicGalleryList />)



