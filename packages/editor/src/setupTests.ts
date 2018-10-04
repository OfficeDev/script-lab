import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import 'jest-styled-components'
import * as mergeStylesSerializer from '@uifabric/jest-serializer-merge-styles'

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

expect.addSnapshotSerializer(mergeStylesSerializer)

// TODO: figure out why this doesn't work
// (having this commented out causes fabric to throw warnings for having uninitialized icons)
// import { setupFabricTheme } from './theme'
// setupFabricTheme()
