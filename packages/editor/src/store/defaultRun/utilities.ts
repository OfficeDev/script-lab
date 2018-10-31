import ts from 'typescript'

const NO_UI_TAG = 'noui'

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
      if (
        ts
          .getJSDocTags(func)
          .map((tag: ts.JSDocTag) => (tag.tagName.escapedText as string).toLowerCase())
          .includes(NO_UI_TAG)
      ) {
        functions.push(func.name!.text)
      }
    } else {
      ts.forEachChild(node, visitNode)
    }
  }
}

export async function execute(
  solutionId: string,
  code: string,
  functionName: string,
  lastUpdated: number,
): Promise<any> {
  return new Promise((resolve, reject) =>
    setTimeout(Math.random() > 0.5 ? resolve : reject, 2000),
  )
}
