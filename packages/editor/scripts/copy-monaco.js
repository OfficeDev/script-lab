const fs = require('fs-extra')

const packageFromPath = '../../node_modules/monaco-editor/min/vs'
const packageToPath = './public/vs'

fs.remove(packageToPath).then(() => fs.copy(packageFromPath, packageToPath))

const typesFromPath = '../../node_modules/monaco-editor/monaco.d.ts'
const typesToPath = './src/interfaces/monaco.d.ts'

fs.remove(typesToPath).then(() => fs.copy(typesFromPath, typesToPath))
