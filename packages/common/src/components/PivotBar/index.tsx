import React from 'react';
import { withTheme } from 'styled-components';
import {
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
} from 'office-ui-fabric-react/lib/Pivot';
import { PivotBarWrapper } from './styles';

export interface IPivotBarItem {
  key: string;
  text?: string;
  iconName?: string;
  testId?: string;
  itemCount?: number;
}

export interface IProps {
  items: IPivotBarItem[];
  selectedKey: string | null;

  backgroundColor?: string;
  selectedColor?: string;
  hideUnderline?: boolean;

  onSelect: (selectedKey: string) => void;

  testId?: string;
  theme: ITheme; // from withTheme
}

class PivotBar extends React.Component<IProps> {
  static defaultProps: Partial<IProps> = {
    hideUnderline: false,
  };

  render() {
    const {
      items,
      selectedKey,
      theme,
      backgroundColor,
      selectedColor,
      hideUnderline,
      testId,
    } = this.props;

    return (
      <PivotBarWrapper>
        <Pivot
          data-testid={testId}
          linkSize={PivotLinkSize.normal}
          linkFormat={PivotLinkFormat.tabs}
          onLinkClick={this.onLinkClick}
          selectedKey={selectedKey || undefined}
          styles={{
            root: { backgroundColor: backgroundColor || theme.primaryDarker },
            link: {
              backgroundColor: backgroundColor || theme.primaryDarker,
              selectors: {
                ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                ':active': { backgroundColor: selectedColor || theme.primaryDarkest },
              },
            },
            linkIsSelected: {
              backgroundColor: selectedColor || theme.primaryDarkest,
              selectors: {
                ':before': {
                  borderBottom: `${hideUnderline ? 0 : 2}px solid ${theme.white}`,
                },
              },
            },
            linkContent: { color: theme.white, fontWeight: '400' },
            icon: { fontSize: '1.6rem' },
          }}
        >
          {items.map(item => (
            <PivotItem
              key={item.key}
              itemKey={item.key}
              linkText={item.text}
              itemIcon={item.iconName}
              data-testid={item.testId}
              itemCount={item.itemCount || undefined}
            />
          ))}
        </Pivot>
      </PivotBarWrapper>
    );
  }

  onLinkClick = (item: PivotItem): void => {
    const key = item.props.itemKey;
    if (key && key !== this.props.selectedKey) {
      this.props.onSelect(key);
    }
  };
}

export default withTheme(PivotBar);
