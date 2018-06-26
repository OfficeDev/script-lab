import React from 'react'
import Content from './Content'
import GalleryList from './GalleryList'

export default ({ samplesMetadataByGroup, openSample }) => (
  <Content title="Samples" description="Choose one of the samples below to get started.">
    {Object.keys(samplesMetadataByGroup).map(group => (
      <GalleryList
        key={group}
        title={group}
        items={samplesMetadataByGroup[group].map(({ id, name, description, rawUrl }) => ({
          key: id,
          title: name,
          description,
          onClick: () => openSample(rawUrl),
        }))}
      />
    ))}
  </Content>
)
