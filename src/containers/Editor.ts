import { connect } from "react-redux";

import { Editor } from "../components";

import {
  getActiveSolutionsFiles,
  getActiveFile,
  changeActiveFile,
} from "../stores/selection";

const mapStateToProps = state => ({
  files: getActiveSolutionsFiles(state),
  activeFile: getActiveFile(state),
});

const mapDispatchToProps = dispatch => ({
  changeActiveFile: (fileId: string) => dispatch(changeActiveFile(fileId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
