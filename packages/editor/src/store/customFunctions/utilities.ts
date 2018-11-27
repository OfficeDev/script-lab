import flatten from 'lodash/flatten';
import semver from 'semver';
import { pause } from '../../utils';
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
