import { connect } from 'react-redux'
import Backstage, { IBackstage } from '../components/Backstage'
import { selectors } from '../reducers'
import { solutions, samples, gists } from '../actions'
import { push } from 'connected-react-router'

const mapStateToProps = (state): Partial<IBackstage> => ({
  sharedGistMetadata: selectors.github.getGistMetadata(state),
  solutions: selectors.solutions.getAllExceptSettings(state),
})

const mapDispatchToProps = (dispatch): Partial<IBackstage> => ({
  createNewSolution: () => dispatch(solutions.create()),
  openSolution: (solutionId: string) => dispatch(push(`/${solutionId}/`)),
  openSample: (rawUrl: string) => dispatch(samples.get.request({ rawUrl })),
  openGist: (rawUrl: string, gistId: string, conflictResolution?: any) =>
    dispatch(gists.get.request({ rawUrl, gistId, conflictResolution })),
  importGist: (gistId?: string, gist?: string) =>
    dispatch(gists.importPublic.request({ gistId, gist })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Backstage)
