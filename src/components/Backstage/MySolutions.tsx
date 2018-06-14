import React from 'react'
import Content from './Content'
import GalleryList from './GalleryList'

// TODO: incorp. localization
// TODO: use real data
export default () => (
  <Content title="My Snippets" description="Choose a snippet that you have saved">
    <GalleryList
      title="My snippets on this computer"
      items={[
        { title: 'Snippet Name 1' },
        { title: 'Snippet Name 2' },
        { title: 'Snippet Name 3' },
      ]}
    />
    <GalleryList
      title="My shared gists on GitHub"
      items={[
        { title: 'Snippet Name 1', description: 'Shared with Script Lab' },
        { title: 'Snippet Name 2', description: 'Shared with Script Lab' },
        { title: 'Snippet Name 3', description: 'Shared with Script Lab' },
        { title: 'Snippet Name 4', description: 'Shared with Script Lab' },
      ]}
    />
  </Content>
)
