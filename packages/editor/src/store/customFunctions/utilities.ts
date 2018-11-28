import flatten from 'lodash/flatten';
import semver from 'semver';

import { pause } from '../../utils';
import { parseMetadata } from './metadata.parser';
import { getCurrentEnv } from '../../environment';

const isCustomFunctionRegex = /@customfunction/i;
export function isCustomFunctionScript(content: string) {
  return isCustomFunctionRegex.test(content);
}

export async function registerMetadata(
  visual: ICFVisualMetadata,
  code: string,
): Promise<void> {
  if (typeof Excel === 'undefined') {
    throw new Error('Excel is not present.');
  }

  const functions = flatten(visual.snippets.map(snippet => snippet.functions));

  const registrationPayload: ICustomFunctionsRegistrationApiMetadata = {
    functions: functions
      .filter(func => func.status === 'good')
      .map(func => {
        const schemaFunc: ICFSchemaFunctionMetadata = {
          name: func.nonCapitalizedFullName.toUpperCase(),
          description: func.description,
          options: func.options,
          result: func.result,
          parameters: func.parameters,
        };
        return schemaFunc;
      }),
  };

  if (Office.context.requirements.isSetSupported('CustomFunctions', 1.3)) {
    await Excel.run(async context => {
      (Excel as any).CustomFunctionManager.newObject(context).register(
        JSON.stringify(registrationPayload, null, 4),
        code,
      );
      await context.sync();
    });
  } else {
    // Older style registration
    await Excel.run(async context => {
      (context.workbook as any).registerCustomFunctions(
        getScriptLabTopLevelNamespace().toUpperCase(),
        JSON.stringify(registrationPayload),
      );
      await context.sync();
    });
  }
}

export async function getCustomFunctionEngineStatus(): Promise<
  ICustomFunctionEngineStatus
> {
  try {
    // TODO:
    // if (environment.current.experimentationFlags.customFunctions.forceOn) {
    //   return { enabled: true }
    // }

    if (!Office.context.requirements.isSetSupported('CustomFunctions', 1.1)) {
      return { enabled: false };
    }

    const platform = Office.context.platform;

    if (platform === Office.PlatformType.PC) {
      if (!Office.context.requirements.isSetSupported('CustomFunctions', 1.3)) {
        return getPCstatusPre1Dot3();
      }
      return getStatusPost1Dot3();
    }

    if (
      platform === Office.PlatformType.Mac &&
      Office.context.requirements.isSetSupported('CustomFunctions', 1.3)
    ) {
      return getStatusPost1Dot3();
    }

    if (platform === Office.PlatformType.OfficeOnline) {
      // On Web: doesn't work yet, need to debug further. It might have to do with Web not expecting non-JSON-inputted functions.  For now, assume that it's off.
      return { enabled: false };
    }

    // Catch-all:
    return { enabled: false };
  } catch (e) {
    console.error('Could not perform a "getCustomFunctionEngineStatus" check');
    console.error(e);
    return { enabled: false };
  }

  // Helpers:
  async function getPCstatusPre1Dot3(): Promise<ICustomFunctionEngineStatus> {
    const threeDotVersion = /(\d+\.\d+\.\d+)/.exec(
      Office.context.diagnostics.version,
    )![1];

    if (semver.lt(threeDotVersion, '16.0.9323')) {
      return { enabled: false };
    }

    return tryExcelRun(
      async (context): Promise<ICustomFunctionEngineStatus> => {
        const featuresThatWantOn = [
          'Microsoft.Office.Excel.AddinDefinedFunctionEnabled',
          'Microsoft.Office.Excel.AddinDefinedFunctionStreamingEnabled',
          'Microsoft.Office.Excel.AddinDefinedFunctionCachingEnabled',
          'Microsoft.Office.Excel.AddinDefinedFunctionUseCalcThreadEnabled',
          'Microsoft.Office.OEP.UdfManifest',
          'Microsoft.Office.OEP.UdfRuntime',
        ].map(
          name =>
            (context as any).flighting
              .getFeatureGate(name)
              .load('value') as OfficeExtension.ClientResult<boolean>,
        );

        const flightThatMustBeOffPre1Dot3 = (context as any).flighting
          .getFeatureGate('Microsoft.Office.OEP.SdxSandbox')
          .load('value') as OfficeExtension.ClientResult<boolean>;

        await context.sync();

        const firstNonTrueIndex = featuresThatWantOn.findIndex(
          item => item.value !== true,
        );
        const allDesirableOnesWereTrue = firstNonTrueIndex < 0;
        if (!allDesirableOnesWereTrue) {
          return { enabled: false };
        }

        if (flightThatMustBeOffPre1Dot3.value) {
          return {
            error: `Conflict: please disable the "Microsoft.Office.OEP.SdxSandbox" flight, or install a newer version of Excel`,
            enabled: false,
          };
        }

        return {
          enabled: true,
          nativeRuntime: false /* older version, so can't have the native runtime there */,
        };
      },
    );
  }

  async function getStatusPost1Dot3(): Promise<ICustomFunctionEngineStatus> {
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

export async function getIsCustomFunctionsSupportedOnHost(): Promise<boolean> {
  try {
    // if (environment.current.experimentationFlags.customFunctions.forceOn) {
    //   return true
    // }
    const platform = Office.context.platform;

    // For now, only supporting on PC
    // On Web: doesn't work yet, need to debug further. It might have to do with Web not expecting non-JSON-inputted functions.
    // On Mac, a number of issues:
    //   - No way to detect flights, to know if the feature is on.  Also, calling "registerCustomFunctions" when flighted off is successful, so can't key off of a failure.
    //   - Heartbeat doesn't work due to Mac iframe + localStorage (not really fixable)
    //   - Other minor things (E.g., copy-paste of starter snippet didn't work for some reason; maybe a general clipboard issue?...)
    if (platform !== Office.PlatformType.PC) {
      return false;
    }

    const threeDotVersion = /(\d+\.\d+\.\d+)/.exec(
      Office.context.diagnostics.version,
    )![1];

    if (semver.lt(threeDotVersion, '16.0.9323')) {
      // note 16.0.9323 is the version number for windows
      // for mac, it is 16.14.429, but
      return false;
    }

    while (true) {
      try {
        // Additionally, we need some flights
        const allFlightsOn = await Excel.run(async context => {
          const features = [
            'Microsoft.Office.Excel.AddinDefinedFunctionEnabled',
            'Microsoft.Office.Excel.AddinDefinedFunctionStreamingEnabled',
            'Microsoft.Office.Excel.AddinDefinedFunctionCachingEnabled',
            'Microsoft.Office.Excel.AddinDefinedFunctionUseCalcThreadEnabled',
            'Microsoft.Office.OEP.UdfManifest',
            'Microsoft.Office.OEP.UdfRuntime',
          ].map(name => (context as any).flighting.getFeatureGate(name).load('value'));
          await context.sync();
          const allWereTrue = features.filter(item => !item.value).length === 0;

          return allWereTrue;
        });

        if (allFlightsOn) {
          break;
        } else {
          return false;
        }
      } catch (e) {
        const isInCellEditMode =
          e instanceof OfficeExtension.Error &&
          e.code === Excel.ErrorCodes.invalidOperationInCellEditMode;
        if (isInCellEditMode) {
          await pause(2000);
          continue;
        } else {
          return false;
        }
      }
    }

    // If all checks passed:
    return true;
  } catch (e) {
    console.error('Could not perform a "getIsCustomFunctionsSupportedOnHost" check');
    console.error(e);
    return false;
  }
}

import { compileScript } from '../core/snippet.generator';
import { stripSpaces } from '../core/utilities';
// import { consoleMonkeypatch } from './console-monkeypatch';

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
