import { connect } from 'react-redux'
import Backstage, { IBackstage } from '../components/Backstage'
import { selectors } from '../reducers'
import { solutions } from '../actions'
import { push } from 'connected-react-router'

const mapStateToProps = (state, ownProps): Partial<IBackstage> => ({})

const mapDispatchToProps = (dispatch): Partial<IBackstage> => ({
  createNewSolution: () => dispatch(solutions.create()),
  openSolution: (solutionId: string) => dispatch(push(`/${solutionId}/`)),
  importGist: (gistUrl: string) => {
    console.log('importing gist url')
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Backstage)
