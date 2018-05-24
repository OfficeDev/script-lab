import React from 'react'

import { storiesOf } from '@storybook/react'

import {
  RunGallery,
  RunGalleryItem,
  RunPane,
  Function,
} from '../src/components'

storiesOf('Run Gallery', module)
  .add('basic', () => (
    <RunGallery>
      {Array.from(Array(50).keys()).map(n => (
        <RunGalleryItem label={`Snippet ${n}`} />
      ))}
    </RunGallery>
  ))
  .add('with default run panes', () => (
    <RunGallery>
      {Array.from(Array(50).keys()).map(n => (
        <RunGalleryItem label={`Snippet ${n}`}>
          <RunPane>
            {Array.from(Array(50).keys()).map(n => (
              <Function name={`function${n}`} />
            ))}
          </RunPane>
        </RunGalleryItem>
      ))}
    </RunGallery>
  ))
