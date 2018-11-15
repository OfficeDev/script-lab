import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// TODO: figure out why this doesn't work
// (having this commented out causes fabric to throw warnings for having uninitialized icons)
// import { setupFabricTheme } from './theme'
// setupFabricTheme()
