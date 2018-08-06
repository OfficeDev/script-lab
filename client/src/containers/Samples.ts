import { connect } from 'react-redux'
import Samples from '../components/Backstage/Samples'
import { selectors } from '../reducers'
import { samples } from '../actions'

const mapStateToProps = state => ({
  samplesByGroup: selectors.samples.getByGroup(state),
})

export default connect(mapStateToProps)(Samples)
