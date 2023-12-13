import React, { Component } from 'react';

import Only from 'common/lib/components/Only';

import Content from '../Content';
import GalleryList from '../GalleryList';
import { SearchBox } from 'office-ui-fabric-react/lib/components/SearchBox';
import { matchesSearch, composeSolutionId } from 'common/lib/utilities/string';

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

  focusOnFirstResult = (filterQuery: string) => {
    let firstSample: ISampleMetadata | undefined = undefined;
    for (const key of Object.keys(this.props.samplesByGroup)) {
      for (const sample of this.props.samplesByGroup[key]) {
        if (matchesSearch(filterQuery, [key, sample.name, sample.description])) {
          firstSample = sample;
          break;
        }
      }
      if (!!firstSample) {
        break;
      }
    }

    if (!!firstSample) {
      const galleryItem = document.getElementById(composeSolutionId(firstSample.name));
      if (galleryItem) {
        galleryItem.focus();
      }
    }
  };

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
        <Only when={samplesByGroup !== null && Object.keys(samplesByGroup).length > 0}>
          <>
            <SearchBox
              data-testid="samples-search"
              placeholder="Search our samples"
              onChange={this.setFilterQuery}
              onSearch={this.focusOnFirstResult}
            />
            {Object.keys(filteredSamplesByGroup)
              .map(group =>
                filteredSamplesByGroup[group].length > 0 ? (
                  <GalleryList
                    key={group}
                    title={group}
                    items={filteredSamplesByGroup[group].map(
                      ({ id, name, description, rawUrl }, index) => ({
                        key: id,
                        title: name,
                        description,
                        onClick: () => openSample(rawUrl),
                        index: index,
                      }),
                    )}
                  />
                ) : null,
              )
              .filter(Boolean)}
          </>
        </Only>

        <Only when={samplesByGroup !== null && Object.keys(samplesByGroup).length === 0}>
          <span className="ms-font-m">There are no samples for this host yet.</span>
        </Only>
      </Content>
    );
  }
}

export default Samples;
