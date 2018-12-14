import flatten from 'lodash/flatten';
import { SCRIPT_FILE_NAME } from '../../../../../constants';
import compileScript from 'common/lib/utilities/compile.script';
import { stripSpaces } from 'common/lib/utilities/string';
import { parseMetadata } from 'common/lib/utilities/custom.functions.metadata.parser';
import { consoleMonkeypatch } from './console.monkeypatch';
import { getCurrentEnv } from 'common/lib/environment';
import { pause, convertSolutionToSnippet } from '../../../../../utils';

const isCustomFunctionRegex = /@customfunction/i;
export function isCustomFunctionScript(content: string) {
  return isCustomFunctionRegex.test(content);
}

export async function registerMetadata(
  functions: ICFVisualFunctionMetadata[],
  code: string,
): Promise<void> {
  const registrationPayload: ICustomFunctionsRegistrationApiMetadata = {
    functions: functions
      .filter(func => func.status === 'good')
      .map(func => {
        const uppercasedFullName = func.nonCapitalizedFullName.toUpperCase();
        const schemaFunc: ICFSchemaFunctionMetadata = {
          id: uppercasedFullName,
          name: uppercasedFullName,
          description: func.description,
          options: func.options,
          result: func.result,
          parameters: func.parameters,
        };
        return schemaFunc;
      }),
  };

  const jsonMetadataString = JSON.stringify(registrationPayload, null, 4);

  if (Office.context.requirements.isSetSupported('CustomFunctions', 1.6)) {
    await (Excel as any).CustomFunctionManager.register(jsonMetadataString, code);
  } else {
    await Excel.run(async context => {
      if (Office.context.platform === Office.PlatformType.OfficeOnline) {
        const namespace = getScriptLabTopLevelNamespace().toUpperCase();
        (context.workbook as any).registerCustomFunctions(
          namespace,
          jsonMetadataString,
          '' /*addinId*/,
          'en-us',
          namespace,
        );
      } else {
        (Excel as any).CustomFunctionManager.newObject(context).register(
          jsonMetadataString,
          code,
        );
      }
      await context.sync();
    });
  }
}

export async function getCustomFunctionEngineStatus(): Promise<
  ICustomFunctionEngineStatus
> {
  try {
    if (!Office.context.requirements.isSetSupported('CustomFunctions', 1.4)) {
      return { enabled: false };
    }

    const platform = Office.context.platform;

    const isOnSupportedPlatform =
      platform === Office.PlatformType.PC ||
      platform === Office.PlatformType.OfficeOnline;
    if (isOnSupportedPlatform) {
      return getEngineStatus();
    }

    return { enabled: false };
  } catch (e) {
    console.error('Could not perform a "getCustomFunctionEngineStatus" check');
    console.error(e);
    return { enabled: false };
  }

  // Helpers:

  async function getEngineStatus(): Promise<ICustomFunctionEngineStatus> {
    if (Office.context.requirements.isSetSupported('CustomFunctions', 1.6)) {
      const status = await (Excel as any).CustomFunctionManager.getStatus();
      return {
        enabled: status.enabled,
        nativeRuntime: status.nativeRuntime,
      };
    } else {
      return tryExcelRun(
        async (context): Promise<ICustomFunctionEngineStatus> => {
          const manager = (Excel as any).CustomFunctionManager.newObject(context).load(
            'status',
          );
          await context.sync();

          return {
            enabled: manager.status.enabled,
            nativeRuntime: manager.status.nativeRuntime,
          };
        },
      );
    }
  }

  async function tryExcelRun(
    callback: (context: Excel.RequestContext) => Promise<ICustomFunctionEngineStatus>,
  ) {
    while (true) {
      try {
        return Excel.run(async context => await callback(context));
      } catch (e) {
        const isInCellEditMode =
          e instanceof OfficeExtension.Error &&
          e.code === Excel.ErrorCodes.invalidOperationInCellEditMode;
        if (isInCellEditMode) {
          await pause(2000);
          continue;
        } else {
          return { enabled: false };
        }
      }
    }
  }
}

export function getScriptLabTopLevelNamespace() {
  return 'ScriptLab' + (getCurrentEnv() === 'local' ? 'Dev' : '');
}

export function getCustomFunctionsInfoForRegistrationFromSolutions(
  solutions: ISolution[],
) {
  return getCustomFunctionsInfoForRegistration(
    solutions.map(solution => convertSolutionToSnippet(solution)),
  );
}

// TODO: merge the code below and above and properly refactor to use ISolution
export function getCustomFunctionsInfoForRegistration(
  snippets: ISnippet[],
): { visual: ICFVisualMetadata; code: string } {
  const visualMetadata: ICFVisualSnippetMetadata[] = [];
  const code: string[] = [decodeURIComponent(consoleMonkeypatch.trim())];

  snippets
    .filter(snippet => snippet.script && snippet.name)
    .forEach(snippet => {
      const namespace = transformSnippetName(snippet.name);

      let snippetFunctions: ICFVisualFunctionMetadata[] = parseMetadata(
        namespace,
        snippet.script!.content,
      ) as ICFVisualFunctionMetadata[];

      snippetFunctions = convertFunctionErrorsToSpace(snippetFunctions);
      if (snippetFunctions.length === 0) {
        // no custom functions found
        return;
      }

      let hasErrors = doesSnippetHaveErrors(snippetFunctions);

      let snippetCode: string;
      if (!hasErrors) {
        try {
          snippetCode = compileScript(snippet.script!.content);
          code.push(
            wrapCustomFunctionSnippetCode(
              snippetCode,
              namespace,
              snippetFunctions.map(func => func.funcName),
            ),
          );
        } catch (e) {
          snippetFunctions.forEach(f => (f.error = 'Snippet compiler error'));
          hasErrors = true;
        }
      }

      snippetFunctions = snippetFunctions.map(func => {
        const status: CustomFunctionsRegistrationStatus = hasErrors
          ? func.error
            ? 'error'
            : 'skipped'
          : 'good';

        func.parameters = func.parameters.map(p => ({
          ...p,
          prettyType: getPrettyType(p),
          status: getFunctionChildNodeStatus(func, status, p),
        }));

        return {
          ...func,
          paramString: paramStringExtractor(func), // todo, i think this can be removed
          status,
          result: {
            ...func.result,
            status: getFunctionChildNodeStatus(func, status, func.result),
          },
        };
      });

      // TODO:  why do we have code commented out?
      // const isTrusted = trustedSnippetManager.isSnippetTrusted(snippet.id, snippet.gist, snippet.gistOwnerId);
      // let status;
      // if (isTrusted) {
      const status: CustomFunctionsRegistrationStatus = hasErrors ? 'error' : 'good';
      // } else {
      //     status = CustomFunctionsRegistrationStatus.Untrusted;
      // }

      visualMetadata.push({
        name: transformSnippetName(snippet.name),
        error: hasErrors,
        status,
        functions: snippetFunctions,
      });
    });

  const visual = { snippets: visualMetadata };

  return { visual, code: code.join('\n\n') };
}

// helpers

function wrapCustomFunctionSnippetCode(
  code: string,
  namespace: string,
  functionNames: string[],
): string {
  const newlineAndIndents = '\n        ';

  const almostReady = stripSpaces(`
    (function () {
      try {
        // TODO external code
        ${code
          .split('\n')
          .map(line => newlineAndIndents + line)
          .join('')}
        ${generateFunctionAssignments(true /*success*/)}
      } catch (e) {
        ${generateFunctionAssignments(false /*success*/)}
      }
    })();
  `);

  return almostReady
    .split('\n')
    .map(line => line.trimRight())
    .join('\n');

  // Helper
  function generateFunctionAssignments(success: boolean) {
    return functionNames
      .map(name => {
        const fullUppercaseName = `${namespace.toUpperCase()}.${name.toUpperCase()}`;
        return `CustomFunctionMappings["${fullUppercaseName}"] = ${getRightSide()};`;

        function getRightSide() {
          return success
            ? `__generateFunctionBinding__("${fullUppercaseName}", ${name})`
            : `__generateErrorFunction__("${fullUppercaseName}", e)`;
        }
      })
      .join(newlineAndIndents);
  }
}

function getFunctionChildNodeStatus(
  func: ICFVisualFunctionMetadata,
  funcStatus: CustomFunctionsRegistrationStatus,
  childNode: { error?: any },
): CustomFunctionsRegistrationStatus {
  return func.error ? (childNode.error ? 'error' : 'skipped') : funcStatus;
}

function getPrettyType(parameter) {
  if (parameter.error) {
    return '';
  }
  const dim = parameter.dimensionality === 'scalar' ? '' : '[][]';
  return `${parameter.type}${dim}`;
}

function paramStringExtractor(func) {
  if (func.error) {
    return undefined;
  }
  return func.parameters
    .map(p => {
      return `${p.name}: ${getPrettyType(p)}`;
    })
    .join(', ');
}

function doesSnippetHaveErrors(snippetMetadata) {
  return snippetMetadata.some(func => func.error);
}

/**
 * This function converts all the `true` errors on the functions to ' '. This is because we still want it
 * to have a truthy value, but not show anything in the UI, and this is the best way I could manage that at this time.
 * @param functions
 */
function convertFunctionErrorsToSpace(
  functions: ICFVisualFunctionMetadata[],
): ICFVisualFunctionMetadata[] {
  return functions.map(func => {
    if (func.error) {
      func.error = ' ';
    }
    return func;
  });
}

const snippetNameRegex = /[^0-9A-Za-z_ ]/g;
export function transformSnippetName(snippetName: string) {
  return snippetName
    .replace(snippetNameRegex, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function getSummaryItems(
  metadata: ICFVisualSnippetMetadata[],
): ICustomFunctionSummaryItem[] {
  return flatten(
    metadata
      .sort((a, b) => {
        if (a.status === 'error' && b.status !== 'error') {
          return -1;
        } else if (a.status !== 'error' && b.status === 'error') {
          return 1;
        } else {
          return 0;
        }
      })
      .map(snippet => {
        const { name } = snippet;
        return snippet.functions.map(({ funcName, status, parameters, result }) => {
          let additionalInfo;
          if (status === 'error') {
            additionalInfo = [];
            parameters.forEach(({ name, error }) => {
              if (error) {
                additionalInfo.push(`${name} - ${error}`);
              }
            });
            if (result.error) {
              additionalInfo.push(`Result - ${result.error}`);
            }
          }
          return {
            snippetName: name,
            funcName,
            status,
            additionalInfo,
          };
        });
      }),
  );
}

export const filterCustomFunctions = (solutions: ISolution[]): ISolution[] => {
  return solutions
    .map(solution => {
      const script = solution.files.find(file => file.name === SCRIPT_FILE_NAME);
      return { solution, script };
    })
    .filter(({ script }) => script && isCustomFunctionScript(script.content))
    .map(({ solution }) => solution);
};
