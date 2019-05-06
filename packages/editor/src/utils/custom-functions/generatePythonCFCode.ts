import flatten from 'lodash/flatten';
import { findScript } from '../../pages/CustomFunctions/components/App/utilities';
import { transformSolutionNameToCFNamespace, PythonCFSnippetRegex } from '.';

const SEPARATOR = '#######################################';

export default (pythonCFs: ISolution[], options: { clearOnRegister: boolean }) => {
  return [
    'import customfunctionmanager',
    options.clearOnRegister ? 'customfunctionmanager.clear()' : null,
    '',
    SEPARATOR,
    '',
    ...flatten(
      pythonCFs
        .filter(solution => !solution.options.isUntrusted)
        .map(solution => {
          const script = findScript(solution).content;
          const namespace = transformSolutionNameToCFNamespace(solution.name);
          return injectNamespace(script, namespace);
        })
        .map(snippet => [snippet, SEPARATOR, '']),
    ),
    'customfunctionmanager.generateMetadata()',
  ]
    .filter(line => line !== null)
    .join('\n');
};

function injectNamespace(script: string, namespace: string) {
  return script.replace(
    PythonCFSnippetRegex,
    (_fullMatch, before: string, customName: string, after: string) => {
      return before + `${namespace}.${customName}` + after;
    },
  );
}
