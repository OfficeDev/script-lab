import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// add some helpful assertions
import 'jest-dom/extend-expect';

// this is basically: afterEach(cleanup)
import 'react-testing-library/cleanup-after-each';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// TODO: figure out why this doesn't work
// (having this commented out causes fabric to throw warnings for having uninitialized icons)
// import { setupFabricTheme } from './theme'
// setupFabricTheme()
