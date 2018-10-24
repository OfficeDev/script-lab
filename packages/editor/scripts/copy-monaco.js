const fs = require('fs-extra')

// const fromPath = '../../node_modules/monaco-editor/min/vs'
const fromPath = '../../node_modules/monaco-editor/dev/vs'
const toPath = './public/vs'

fs.remove(toPath).then(() => fs.copy(fromPath, toPath))
