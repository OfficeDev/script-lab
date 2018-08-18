import { connect } from 'react-redux'
import selectors from '../store/selectors'
import { host as hostActions } from '../store/actions'
import Footer, {
  IFooter,
  IFooterPropsFromRedux,
  IFooterActionsFromRedux,
} from '../components/Footer'
import { push } from 'connected-react-router'
import { SETTINGS_SOLUTION_ID, SETTINGS_FILE_ID } from '../constants'

const mapStateToProps = (state, ownProps: IFooter): IFooterPropsFromRedux => ({
  language: ownProps.activeFile.language,
  currentHost: selectors.host.get(state),
  isWeb: selectors.host.getIsWeb(state),
})

const mapDispatchToProps = (dispatch): IFooterActionsFromRedux => ({
  onSettingsIconClick: () =>
    dispatch(push(`/${SETTINGS_SOLUTION_ID}/${SETTINGS_FILE_ID}`)),
  changeHost: (host: string) => dispatch(hostActions.change(host)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer)
