import React, { Component } from 'react';

import Only from 'common/lib/components/Only';

import Content from '../Content';
import GalleryList from '../GalleryList';
import { SearchBox } from 'office-ui-fabric-react/lib/components/SearchBox';
import { matchesSearch } from 'common/lib/utilities/string';

interface IProps {
  samplesByGroup: ISampleMetadataByGroup;
  openSample: (rawUrl: string) => void;
}

interface IState {
  filterQueryLowercase: string;
}

class Samples extends Component<IProps, IState> {
  state: IState = { filterQueryLowercase: '' };

  setFilterQuery = (filterQuery: string) =>
    this.setState({ filterQueryLowercase: filterQuery.toLowerCase() });

  render() {
    const { samplesByGroup, openSample } = this.props;

    const filteredSamplesByGroup =
      this.state.filterQueryLowercase !== ''
        ? Object.keys(samplesByGroup).reduce(
            (all, group) => ({
              ...all,
              [group]: samplesByGroup[group].filter((sample: ISampleMetadata) =>
                matchesSearch(this.state.filterQueryLowercase, [
                  group,
                  sample.name,
                  sample.description,
                ]),
              ),
            }),
            {},
          )
        : samplesByGroup;

    return (
      <Content
        title="Samples"
        description="Choose one of the samples below to get started."
      >
        <Only when={Object.keys(samplesByGroup).length > 0}>
          <SearchBox
            data-testid="samples-search"
            placeholder="Search our samples"
            onChange={this.setFilterQuery}
          />
        </Only>

        {Object.keys(filteredSamplesByGroup).length > 0 ? (
          Object.keys(filteredSamplesByGroup)
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
            .filter(Boolean)
        ) : (
          <span className="ms-font-m">There aren't any samples for this host yet.</span>
        )}
      </Content>
    );
  }
}

export default Samples;
