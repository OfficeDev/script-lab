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
      {Array.from(Array(50).keys()).map(i => (
        <RunGalleryItem label={`Snippet ${i}`} />
      ))}
    </RunGallery>
  ))
  .add('with default run panes', () => (
    <RunGallery>
      {Array.from(Array(50).keys()).map(n => (
        <RunGalleryItem label={`Snippet ${n}`}>
          <RunPane>
            {Array.from(Array(50).keys()).map(m => (
              <Function name={`function${m}`} />
            ))}
          </RunPane>
        </RunGalleryItem>
      ))}
    </RunGallery>
  ))
