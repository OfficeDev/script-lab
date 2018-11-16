const fs = require('fs-extra');
const filesToCopy = [
  {
    from: '../../node_modules/monaco-editor/min/vs',
    to: './public/external/vs',
  },
  {
    from: '../../node_modules/monaco-editor/monaco.d.ts',
    to: './src/interfaces/monaco.d.ts',
  },
  {
    from: '../../node_modules/office-ui-fabric-core/dist/css/fabric.min.css',
    to: './public/external/office-ui-fabric-core/fabric.min.css',
  },
];
filesToCopy.forEach(pair => {
  fs.removeSync(pair.to);
  fs.copySync(pair.from, pair.to);
});
