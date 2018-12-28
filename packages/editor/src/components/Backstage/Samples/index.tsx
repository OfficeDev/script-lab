import React from 'react';

import Content from '../Content';
import GalleryList from '../GalleryList';

interface IProps {
  samplesByGroup: ISampleMetadataByGroup;
  openSample: (rawUrl: string) => void;
}

const Samples = ({ samplesByGroup, openSample }: IProps) => (
  <Content title="Samples" description="Choose one of the samples below to get started.">
    {Object.keys(samplesByGroup).length > 0 ? (
      Object.keys(samplesByGroup).map(group => (
        <GalleryList
          key={group}
          title={group}
          items={samplesByGroup[group].map(({ id, name, description, rawUrl }) => ({
            key: id,
            title: name,
            description,
            onClick: () => openSample(rawUrl),
          }))}
        />
      ))
    ) : (
      <span className="ms-font-m">There aren't any samples for this host yet.</span>
    )}
  </Content>
);

export default Samples;
