import 'common/lib/polyfills';
import { HYPHENATED_PACKAGE_VERSIONS } from 'common/lib/package-versions';

(window as any).require = require(`../public/external/monaco-editor-${HYPHENATED_PACKAGE_VERSIONS['monaco-editor']}/vs/loader`);

// this is basically: afterEach(cleanup)
import 'react-testing-library/cleanup-after-each';

// TODO: figure out why this doesn't work
// (having this commented out causes fabric to throw warnings for having uninitialized icons)
// import { setupFabricTheme } from './theme'
// setupFabricTheme()
