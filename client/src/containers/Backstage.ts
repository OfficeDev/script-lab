import { connect } from 'react-redux'
import Backstage, {
  IBackstage,
  IBackstagePropsFromRedux,
  IBackstageActionsFromRedux,
} from '../components/Backstage'
import selectors from '../store/selectors'
import { solutions, samples, gists } from '../store/actions'
import { push } from 'connected-react-router'

import { getTheme } from '../theme'

const mapStateToProps = (state): IBackstagePropsFromRedux => ({
  sharedGistMetadata: selectors.gists.getGistMetadata(state),
  solutions: selectors.solutions.getAll(state),
  samplesByGroup: selectors.samples.getMetadataByGroup(state),
  theme: getTheme(selectors.host.get(state)),
})

const mapDispatchToProps = (dispatch): IBackstageActionsFromRedux => ({
  createNewSolution: () => dispatch(solutions.create()),
  openSolution: (solutionId: string) => dispatch(push(`/${solutionId}/`)),
  openSample: (rawUrl: string) => dispatch(samples.get.request({ rawUrl })),
  openGist: (rawUrl: string, gistId: string, conflictResolution?: any) =>
    dispatch(gists.get.request({ rawUrl, gistId, conflictResolution })),
  importGist: (gistId?: string, gist?: string) =>
    dispatch(gists.importSnippet.request({ gistId, gist })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Backstage)
