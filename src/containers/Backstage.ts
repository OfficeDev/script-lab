import { connect } from 'react-redux'
import Backstage, { IBackstage } from '../components/Backstage'
import { selectors } from '../reducers'
import { solutions, samples } from '../actions'
import { push } from 'connected-react-router'

const mapStateToProps = (state, ownProps): Partial<IBackstage> => ({
  samplesMetadataByGroup: selectors.samples.getByGroup(state),
})

const mapDispatchToProps = (dispatch): Partial<IBackstage> => ({
  createNewSolution: () => dispatch(solutions.create()),
  openSolution: (solutionId: string) => dispatch(push(`/${solutionId}/`)),
  openSample: (rawUrl: string) => dispatch(samples.get(rawUrl)),
  importGist: (gistUrl: string) => {
    console.log('importing gist url')
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Backstage)
