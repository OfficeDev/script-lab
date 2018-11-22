import { pause } from '../utils';
import { getCurrentEnv } from '../environment';

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
  if (!Office || !Office.context || !Office.context.requirements) {
    throw new Error('This page is expected to only run inside of Excel');
  }

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

export function getScriptLabTopLevelNamespace() {
  return 'ScriptLab' + (getCurrentEnv() === 'local' ? 'Dev' : '');
}
