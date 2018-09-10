import React from 'react'

import Menu, { IMenuItem } from './'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

const menuItems: IMenuItem[] = [
  {
    key: 'back',
    icon: 'GlobalNavButton',
    onClick: action('back-clicked'),
  },
  {
    key: 'new',
    label: 'New Snippet',
    icon: 'Add',
    onClick: action('new-clicked'),
  },
  {
    key: 'my-solutions',
    label: 'My Snippets',
    icon: 'DocumentSet',
    onClick: action('my-solutions-clicked'),
  },
  {
    key: 'samples',
    label: 'Samples',
    icon: 'Dictionary',
    onClick: action('samples-clicked'),
  },
  {
    key: 'import',
    label: 'Import',
    icon: 'Download',
    onClick: action('import-clicked'),
  },
]

storiesOf('Backstage/Menu', module).add('basic', () => (
  <Menu items={menuItems} selectedKey={menuItems[2].key} />
))
