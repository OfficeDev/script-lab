import ts from 'typescript';

export class SyntaxError extends Error {}

export function compileScript(content: string) {
  const result = ts.transpileModule(content, {
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES5,
      allowJs: true,
      lib: ['dom', 'es2015'],
    },
  });

  if (result.diagnostics!.length) {
    throw new SyntaxError(
      result
        .diagnostics!.map(item => {
          const upThroughError = content.substr(0, item.start);
          const afterError = content.substr(item.start! + 1);
          const lineNumber = upThroughError.split('\n').length;
          const startIndexOfThisLine = upThroughError.lastIndexOf('\n');
          const lineText = content
            .substring(
              startIndexOfThisLine,
              item.start! + Math.max(afterError.indexOf('\n'), 0),
            )
            .trim();

          return `Line #${lineNumber}: ${item.messageText}` + '\n ' + lineText;
        })

        .join('\n\n'),
    );
  }

  // HACK: Need to manually remove es2015 module generation
  return result.outputText.replace(
    'Object.defineProperty(exports, "__esModule", { value: true });',
    '',
  );
}
