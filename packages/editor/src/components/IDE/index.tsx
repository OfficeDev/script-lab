import React, { Component } from 'react';

import Header from './Header';
import FileSwitcherPivot from './FileSwitcherPivot';
import Editor from './Editor';
import Footer from './Footer';

import Notifications from '../Notifications';

import { Layout, ContentWrapper } from './styles';
import { NULL_SOLUTION, NULL_FILE } from '../../constants';

import { connect } from 'react-redux';
import { IState as IReduxState } from '../../store/reducer';
import selectors from '../../store/selectors';
import { editor as editorActions } from '../../store/actions';

interface IPropsFromRedux {
  isVisible: boolean;
  hasLoaded: boolean;
  activeSolution: ISolution;
  activeFile: IFile;
}

const mapStateToProps = (state: IReduxState): Partial<IPropsFromRedux> => ({
  isVisible: state.editor.isVisible,
  hasLoaded: state.editor.hasLoaded,
  activeSolution: selectors.editor.getActiveSolution(state),
  activeFile: selectors.editor.getActiveFile(state),
});

interface IActionsFromRedux {
  openFile: (solutionId: string, fileId: string) => void;
}

const mapDispatchToProps = (dispatch): IActionsFromRedux => ({
  openFile: (solutionId: string, fileId: string) =>
    dispatch(editorActions.openFile({ solutionId, fileId })),
});

export interface IIDE extends IPropsFromRedux, IActionsFromRedux {}

class IDE extends Component<IIDE> {
  static defaultProps: Partial<IIDE> = {
    activeSolution: NULL_SOLUTION,
    activeFile: NULL_FILE,
  };

  changeActiveFile = (fileId: string) =>
    this.props.openFile(this.props.activeSolution.id, fileId);

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IDE);
