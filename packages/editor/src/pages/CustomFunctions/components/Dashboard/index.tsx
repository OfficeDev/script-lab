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
import { currentEditorUrl } from 'common/lib/environment';

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
            // Force a page reload via an indirect route, first loading a different
            //   html page that will redirect back to the regular editor URL.
            // The reason can't go directly is that if only do a hash-level navigation,
            //   will end up loading Office.js twice (which throws an error).
            // And can't do a href-setting followed by a reload because on the Edge browser,
            //   it seems to cause the outer Office Online window to get redirected
            //   to the editor page (bug https://github.com/OfficeDev/script-lab/issues/691).
            window.location.href = currentEditorUrl + '/' + 'redirect-to-editor.html';
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
