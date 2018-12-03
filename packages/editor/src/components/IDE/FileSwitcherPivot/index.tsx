import React from 'react';
import { connect } from 'react-redux';

import PivotBar from '../../PivotBar';

import { LIBRARIES_FILE_NAME, SCRIPT_FILE_NAME } from '../../../constants';
import { actions, selectors } from '../../../store';
import { IState as IReduxState } from '../../../store/reducer';
import { IRootAction } from '../../../store/actions';
import { Dispatch } from 'redux';

const FILE_NAME_MAP = {
  [SCRIPT_FILE_NAME]: 'Script',
  'index.html': 'HTML',
  'index.css': 'CSS',
  [LIBRARIES_FILE_NAME]: 'Libraries',
};

interface IPropsFromRedux {
  files: IFile[];
  activeFile: IFile;
}

const mapStateToProps = (state: IReduxState): IPropsFromRedux => ({
  files: selectors.editor.getActiveSolution(state).files,
  activeFile: selectors.editor.getActiveFile(state),
});

interface IActionsFromRedux {
  openFile: (fileId: string) => void;
}

const mapDipatchToProps = (dispatch: Dispatch<IRootAction>): IActionsFromRedux => ({
  openFile: (fileId: string) => dispatch(actions.editor.openFile({ fileId })),
});

interface IProps extends IPropsFromRedux, IActionsFromRedux {}

const FileSwitcherPivot = ({ files, activeFile, openFile }: IProps) => (
  <PivotBar
    items={files.map(file => ({
      key: file.id,
      text: FILE_NAME_MAP[file.name] || file.name,
    }))}
    selectedKey={activeFile.id}
    onSelect={openFile}
    data-test-id="file-switcher-pivot"
  />
);

export default connect(
  mapStateToProps,
  mapDipatchToProps,
)(FileSwitcherPivot);
