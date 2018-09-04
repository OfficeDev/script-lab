import React from 'react'

import GalleryListItem, {IGalleryListItem} from './'

import { storiesOf } from '@storybook/react'
const voidFunc = () => { }


const stories = storiesOf('Backstage/GalleryList/Item', module)

stories.add('basic', () => <GalleryListItem key='key1' title='Example Title of a Gallery List Item' description='This is a description of a gallery list item' />)
