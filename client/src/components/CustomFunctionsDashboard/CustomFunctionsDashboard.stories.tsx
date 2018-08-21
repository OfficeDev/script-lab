import React from 'react'

import CustomFunctionsDashboard from './'

import { checkA11y } from '@storybook/addon-a11y'
import { storiesOf } from '@storybook/react'

const stories = storiesOf('Custom Functions Dashboard', module)

stories.addDecorator(checkA11y).add('basic', () => <CustomFunctionsDashboard />)
