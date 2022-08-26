import React, { Component } from 'react';
import { GalleryListWrapper, TitleBar, Title, ArrowWrapper } from './styles';

import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import GalleryListItem, { IGalleryListItem } from './GalleryListItem';
import Only from 'common/lib/components/Only';

export interface IProps {
  title: string;
  messageBar?: React.ReactElement<any>;
  items: IGalleryListItem[];
  testId?: string;
}

interface IState {
  isExpanded: boolean;
}

class GalleryList extends Component<IProps, IState> {
  state: IState = { isExpanded: true };

  toggleExpansion = () => this.setState({ isExpanded: !this.state.isExpanded });

  render() {
    const { title, messageBar, items, testId } = this.props;
    const { isExpanded } = this.state;
    return (
      <GalleryListWrapper>
        <FocusZone>
          <TitleBar>
            <Title>{title}</Title>
            <ArrowWrapper
              role={'button'}
              aria-label={title + " section " + (isExpanded ? 'Hide' : 'Show')}
              onClick={this.toggleExpansion}
              data-is-focusable={true}
            >
              <Icon iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'} />
            </ArrowWrapper>
          </TitleBar>
          <Only when={messageBar !== undefined}>{messageBar}</Only>
          <Only when={isExpanded}>
            <div data-testid={testId}>
              {items.map(item => (
                <GalleryListItem key={item.key} {...item} />
              ))}
            </div>
          </Only>
        </FocusZone>
      </GalleryListWrapper>
    );
  }
}

export default GalleryList;
