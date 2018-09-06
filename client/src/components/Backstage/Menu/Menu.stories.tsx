import React from 'react'

import Menu, { IProps as IMenu, IMenuItem } from './'

import { storiesOf } from '@storybook/react'
const voidFunc = () => {}

const menuItems: IMenuItem[] = [
  {
    key: 'back',
    icon: 'GlobalNavButton',
    onClick: voidFunc,
  },
  {
    key: 'new',
    label: 'New Snippet',
    icon: 'Add',
    onClick: voidFunc,
  },
  {
    key: 'my-solutions',
    label: 'My Snippets',
    icon: 'DocumentSet',
    onClick: voidFunc,
  },
  {
    key: 'samples',
    label: 'Samples',
    icon: 'Dictionary',
    onClick: voidFunc,
  },
  {
    key: 'import',
    label: 'Import',
    icon: 'Download',
    onClick: voidFunc,
  },
]

const stories = storiesOf('Backstage/Menu', module)

stories.add('basic', () => <Menu items={menuItems} selectedKey={menuItems[2].key} />)
