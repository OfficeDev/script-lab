const fs = require('fs-extra');

// Remove old files:
if (fs.existsSync('./public/vs')) {
  fs.removeSync('./public/vs');
}

const filesToCopy = [
  {
    from: '../../node_modules/monaco-editor/min/vs',
    to: './public/external/vs',
  },
  {
    from: '../../node_modules/monaco-editor/monaco.d.ts',
    to: './src/interfaces/monaco.d.ts',
  },
];
filesToCopy.forEach(pair => {
  fs.removeSync(pair.to);
  fs.copySync(pair.from, pair.to);
});
