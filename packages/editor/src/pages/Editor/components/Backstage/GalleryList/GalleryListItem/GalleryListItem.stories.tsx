import React from 'react';

import GalleryListItem, { IGalleryListItem } from './';

import { storiesOf } from '@storybook/react';

export const getBasicGalleryListItemProps = (n: number): IGalleryListItem => ({
  key: `key-${n}`,
  title: `Example Title ${n} for a Gallery List Item ${n}`,
  description: `This is a description for gallery list item ${n}`,
});
export const BasicGalleryListItem = props => <GalleryListItem {...props} />;

storiesOf('Backstage|GalleryList/Item', module)
  .add('basic', () => <BasicGalleryListItem {...getBasicGalleryListItemProps(1)} />)
  .add('active', () => (
    <BasicGalleryListItem {...{ ...getBasicGalleryListItemProps(1), isActive: true }} />
  ));
