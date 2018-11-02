import ts from 'typescript'
import RuntimeManager from './runtime/RuntimeManager'

let runtimeManager
try {
  runtimeManager = RuntimeManager.getInstance()
} catch (error) {
  console.error(error)
}

export function findAllNoUIFunctions(content: string): string[] {
  const sourceFile = ts.createSourceFile(
    'someFileName',
    content,
    ts.ScriptTarget.ES2015,
    true,
  )

  const functions: string[] = []
  visitNode(sourceFile)
  return functions

  function visitNode(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
      const func = node as ts.FunctionDeclaration
      functions.push(func.name!.text)
    } else {
      ts.forEachChild(node, visitNode)
    }
  }
}

export async function terminateAll() {
  if (runtimeManager) {
    runtimeManager.terminateAll()
  }
}

export async function execute(
  solutionId: string,
  code: string,
  functionName: string,
  lastUpdated: number,
): Promise<any> {
  if (runtimeManager) {
    return runtimeManager.executeScript(
      solutionId,
      compileScript('typescript', code),
      functionName,
      [],
      lastUpdated,
    )
  }
  return null
}

export function compileScript(language: string, content: string): string {
  switch (language.toLowerCase()) {
    case 'typescript':
      return compileTypeScript(content)

    case 'javascript':
      return content

    default:
      throw new Error(`Unrecognized language: ${language}`)
  }
}

function compileTypeScript(content: string) {
  const result = ts.transpileModule(content, {
    reportDiagnostics: true,

    compilerOptions: {
      target: ts.ScriptTarget.ES5,

      allowJs: true,

      lib: ['dom', 'es2015'],
    },
  })

  if (result.diagnostics!.length) {
    throw new Error(
      result
        .diagnostics!.map(item => {
          const upThroughError = content.substr(0, item.start)
          const afterError = content.substr(item.start! + 1)
          const lineNumber = upThroughError.split('\n').length
          const startIndexOfThisLine = upThroughError.lastIndexOf('\n')
          const lineText = content
            .substring(
              startIndexOfThisLine,
              item.start! + Math.max(afterError.indexOf('\n'), 0),
            )
            .trim()

          return `#${lineNumber}: ${item.messageText}` + '\n ' + lineText
        })

        .join('\n\n'),
    )
  }

  // HACK: Need to manually remove es2015 module generation

  return result.outputText.replace(
    'Object.defineProperty(exports, "__esModule", { value: true });',

    '',
  )
}
