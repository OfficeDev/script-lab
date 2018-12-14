import React from 'react';
import Header from 'common/lib/components/Header';
import Footer from 'common/lib/components/Footer';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';
import PivotBar from 'common/lib/components/PivotBar';
import Only from 'common/lib/components/Only';

import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

interface IProps {
  isStandalone: boolean;
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
    const { items, isStandalone, shouldPromptRefresh } = this.props;

    const goBackItem = {
      key: 'go-back',
      iconOnly: true,
      iconProps: { iconName: 'Back' },
      onClick: isStandalone ? null : () => window.history.back(),
    };

    const titleItem = {
      key: 'title',
      text: 'Custom Functions (Preview)',
      onClick: this.reload,
    };

    const headerItems = !isStandalone ? [goBackItem, titleItem] : [titleItem];

    return (
      <div style={{ height: '100vh' }}>
        <HeaderFooterLayout
          header={
            <>
              <Header items={headerItems} />
              <PivotBar
                items={Object.keys(items).map(key => ({
                  key,
                  text: key,
                }))}
                selectedKey={selectedKey}
                onSelect={this.setSelectedKey}
              />
            </>
          }
          footer={<Footer items={[]} />}
        >
          <>
            <Only when={shouldPromptRefresh}>
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
            </Only>

            {items[selectedKey]}
          </>
        </HeaderFooterLayout>
      </div>
    );
  }
}

export default Dashboard;
