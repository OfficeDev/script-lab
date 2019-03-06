import 'common/lib/polyfills';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { HYPHENATED_PACKAGE_VERSIONS } from 'common/lib/package-versions';

// tslint:disable-next-line:no-var-requires
(window as any).require = require(`../public/external/monaco-editor-${
  HYPHENATED_PACKAGE_VERSIONS['monaco-editor']
}/vs/loader`);

// this is basically: afterEach(cleanup)
import 'react-testing-library/cleanup-after-each';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// TODO: figure out why this doesn't work
// (having this commented out causes fabric to throw warnings for having uninitialized icons)
// import { setupFabricTheme } from './theme'
// setupFabricTheme()
