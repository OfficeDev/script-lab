import React, { Component } from 'react';

import Only from 'common/lib/components/Only';

import Content from '../Content';
import GalleryList from '../GalleryList';
import { SearchBox } from 'office-ui-fabric-react/lib/components/SearchBox';

interface IProps {
  samplesByGroup: ISampleMetadataByGroup;
  openSample: (rawUrl: string) => void;
}

interface IState {
  filterQuery: string;
}

class Samples extends Component<IProps, IState> {
  state: IState = { filterQuery: '' };

  setFilterQuery = (filterQuery: string) => this.setState({ filterQuery });

  render() {
    const { samplesByGroup, openSample } = this.props;

    const filteredSamplesByGroup =
      this.state.filterQuery !== ''
        ? Object.keys(samplesByGroup).reduce(
            (all, group) => ({
              ...all,
              [group]: samplesByGroup[group].filter((sample: ISampleMetadata) => {
                const megastring = [sample.name, sample.description]
                  .filter(Boolean)
                  .join(' ');
                return megastring.includes(this.state.filterQuery);
              }),
            }),
            {},
          )
        : samplesByGroup;

    return (
      <Content
        title="Samples"
        description="Choose one of the samples below to get started."
      >
        <Only when={samplesByGroup !== null && Object.keys(samplesByGroup).length > 0}>
          <>
            <SearchBox
              data-testid="samples-search"
              placeholder="Search our samples"
              onChange={this.setFilterQuery}
            />
            {Object.keys(filteredSamplesByGroup)
              .map(group =>
                filteredSamplesByGroup[group].length > 0 ? (
                  <GalleryList
                    key={group}
                    title={group}
                    items={filteredSamplesByGroup[group].map(
                      ({ id, name, description, rawUrl }) => ({
                        key: id,
                        title: name,
                        description,
                        onClick: () => openSample(rawUrl),
                      }),
                    )}
                  />
                ) : null,
              )
              .filter(Boolean)}
          </>
        </Only>

        <Only when={samplesByGroup !== null && Object.keys(samplesByGroup).length === 0}>
          <span className="ms-font-m">There aren't any samples for this host yet.</span>
        </Only>
      </Content>
    );
  }
}

export default Samples;
