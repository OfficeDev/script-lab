import React from 'react';
import Header from 'common/lib/components/Header';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';
import PivotBar from 'common/lib/components/PivotBar';
import Only from 'common/lib/components/Only';

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import Welcome from '../Welcome';
import { ColumnFlexContainer } from './styles';

interface IProps {
  isStandalone: boolean;
  hasAny: boolean;
  shouldPromptRefresh: boolean;
  items: { [itemName: string]: React.ReactElement<any> };
}

interface IState {
  selectedKey: string;
}

class Dashboard extends React.Component<IProps, IState> {
  state: IState = {
    selectedKey:
      Object.keys(this.props.items).length > 0 ? Object.keys(this.props.items)[0] : '',
  };

  setSelectedKey = (selectedKey: string) => this.setState({ selectedKey });

  reload = () => window.location.reload();

  render() {
    const { selectedKey } = this.state;
    const { hasAny, items, isStandalone, shouldPromptRefresh } = this.props;

    const goBackItem = {
      key: 'go-back',
      iconOnly: true,
      iconProps: { iconName: 'Back' },
      onClick: isStandalone
        ? null
        : () => {
            // Update the hash and then force a page reload.
            // Otherwise can end up loading Office.js twice (which throws an error)
            // Note that once Custom Functions is out of Preview, and we can use the
            //   same public CDN for all of the editor, this will no longer be necessary
            window.location.hash = '#';
            window.location.reload();
          },
    };

    const titleItem = {
      key: 'title',
      text: 'Custom Functions (Preview)',
      onRenderIcon: () => <Icon iconName="Refresh" style={{ padding: '.4rem' }} />,
      onClick: this.reload,
    };

    const headerItems = !isStandalone ? [goBackItem, titleItem] : [titleItem];

    return (
      <HeaderFooterLayout
        fullscreen={true}
        header={
          <>
            <Header items={headerItems} />
            <Only when={hasAny}>
              <PivotBar
                items={Object.keys(items).map(key => ({
                  key,
                  text: key,
                }))}
                selectedKey={selectedKey}
                onSelect={this.setSelectedKey}
              />
            </Only>
          </>
        }
        footer={null}
      >
        <ColumnFlexContainer>
          {shouldPromptRefresh ? (
            <MessageBar
              messageBarType={MessageBarType.info}
              isMultiline={true}
              actions={
                <div>
                  <DefaultButton primary={true} onClick={this.reload}>
                    Reload
                  </DefaultButton>
                </div>
              }
            >
              You have made changes to your Custom Functions. Would you like to
              re-register?
            </MessageBar>
          ) : null}

          {hasAny ? (
            <ColumnFlexContainer>{items[selectedKey]}</ColumnFlexContainer>
          ) : (
            <Welcome isRefreshEnabled={shouldPromptRefresh} />
          )}
        </ColumnFlexContainer>
      </HeaderFooterLayout>
    );
  }
}

export default Dashboard;
