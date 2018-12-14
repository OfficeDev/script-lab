import React, { Component } from 'react';

import Header from './Header';
import FileSwitcherPivot from './FileSwitcherPivot';
import Editor from './Editor';
import Footer from './Footer';

import Notifications from '../../../../components/Notifications';

import { Layout, ContentWrapper } from './styles';
import { NULL_SOLUTION, NULL_FILE } from '../../../../constants';

import { connect } from 'react-redux';
import { IState as IReduxState } from '../../store/reducer';
import selectors from '../../store/selectors';
import { editor as editorActions, IRootAction } from '../../store/actions';
import { Dispatch } from 'redux';

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

export interface IIDE extends IPropsFromRedux {}

class IDE extends Component<IIDE> {
  static defaultProps: Partial<IIDE> = {
    activeSolution: NULL_SOLUTION,
    activeFile: NULL_FILE,
  };

  render() {
    const { isVisible, hasLoaded, activeSolution, activeFile } = this.props;
    return (
      <Layout
        style={
          isVisible && hasLoaded
            ? { visibility: 'visible' }
            : { visibility: 'hidden', opacity: hasLoaded ? 1 : 0 }
        }
      >
        <Header solution={activeSolution} file={activeFile} />
        <FileSwitcherPivot />
        <Notifications />
        <ContentWrapper>
          <Editor
            activeSolution={activeSolution}
            activeFiles={activeSolution.files}
            activeFile={activeFile}
            isVisible={isVisible && hasLoaded}
          />
        </ContentWrapper>
        <Footer />
      </Layout>
    );
  }
}

export default connect(mapStateToProps)(IDE);
