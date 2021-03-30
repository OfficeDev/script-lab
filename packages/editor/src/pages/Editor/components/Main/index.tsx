import React, { Component } from 'react';

import Header from './Header';
import FileSwitcherPivot from './FileSwitcherPivot';
import Editor from './Editor';
import Footer from './Footer';

import Notifications from '../Notifications';

import { ContentWrapper } from './styles';
import { NULL_SOLUTION, NULL_FILE } from '../../../../constants';

import { connect } from 'react-redux'; // Note, avoid the temptation to include '@types/react-redux', it will break compile-time!
import { IState as IReduxState } from '../../store/reducer';
import selectors from '../../store/selectors';
import HeaderFooterLayout from 'common/lib/components/HeaderFooterLayout';

interface IPropsFromRedux {
  isVisible: boolean;
  hasLoaded: boolean;
  activeSolution: ISolution;
  activeFile: IFile;
}

const mapStateToProps = (state: IReduxState): IPropsFromRedux => ({
  isVisible: state.editor.isVisible,
  hasLoaded: state.editor.hasLoaded,
  activeSolution: selectors.editor.getActiveSolution(state),
  activeFile: selectors.editor.getActiveFile(state),
});

export interface IProps extends IPropsFromRedux {}

class IDE extends Component<IProps> {
  static defaultProps: Partial<IProps> = {
    activeSolution: NULL_SOLUTION,
    activeFile: NULL_FILE,
  };

  render() {
    const { isVisible, hasLoaded, activeSolution, activeFile } = this.props;
    return (
      <HeaderFooterLayout
        fullscreen={true}
        header={
          <>
            <Header />
            <FileSwitcherPivot />
          </>
        }
        footer={<Footer />}
        wrapperStyle={
          isVisible && hasLoaded
            ? { visibility: 'visible' }
            : { visibility: 'hidden', opacity: hasLoaded ? 1 : 0 }
        }
      >
        <>
          <Notifications />
          <ContentWrapper>
            <Editor
              activeSolution={activeSolution}
              activeFiles={activeSolution.files}
              activeFile={activeFile}
              isVisible={isVisible && hasLoaded}
            />
          </ContentWrapper>
        </>
      </HeaderFooterLayout>
    );
  }
}

export default connect(mapStateToProps)(IDE);
