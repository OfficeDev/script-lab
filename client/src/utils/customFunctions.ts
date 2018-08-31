import flatten from 'lodash/flatten'
import semver from 'semver'
import { pause } from '../utils'

const isCustomFunctionRegex = /@customfunction/i
export function isCustomFunctionScript(content: string) {
  return isCustomFunctionRegex.test(content)
}

export async function registerMetadata(
  visual: ICFVisualMetadata,
  code: string,
): Promise<void> {
  if (typeof Excel === 'undefined') {
    throw new Error('Excel is not present.')
  }

  const functions = flatten(visual.snippets.map(snippet => snippet.functions))

  const registrationPayload: ICustomFunctionsRegistrationApiMetadata = {
    functions: functions.filter(func => func.status === 'good').map(func => {
      const schemaFunc: ICFSchemaFunctionMetadata = {
        name: func.nonCapitalizedFullName.toUpperCase(),
        description: func.description,
        options: func.options,
        result: func.result,
        parameters: func.parameters,
      }
      return schemaFunc
    }),
  }

  if (Office.context.requirements.isSetSupported('CustomFunctions', 1.3)) {
    const excel = Excel as any
    await Excel.run(async context => {
      excel.CustomFunctionManager.newObject(context).register(
        JSON.stringify(registrationPayload, null, 4),
        code,
      )
      await context.sync()
    })
  } else {
    // Older style registration
    await Excel.run(async context => {
      const workbook = context.workbook as any
      workbook.registerCustomFunctions(
        getScriptLabTopLevelNamespace().toUpperCase(),
        JSON.stringify(registrationPayload),
      )
      await context.sync()
    })
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
      return { enabled: false }
    }

    const platform = Office.context.platform

    if (platform === Office.PlatformType.PC) {
      if (!Office.context.requirements.isSetSupported('CustomFunctions', 1.3)) {
        return getPCstatusPre1Dot3()
      }
      return getStatusPost1Dot3()
    }

    if (
      platform === Office.PlatformType.Mac &&
      Office.context.requirements.isSetSupported('CustomFunctions', 1.3)
    ) {
      return getStatusPost1Dot3()
    }

    if (platform === Office.PlatformType.OfficeOnline) {
      // On Web: doesn't work yet, need to debug further. It might have to do with Web not expecting non-JSON-inputted functions.  For now, assume that it's off.
      return { enabled: false }
    }

    // Catch-all:
    return { enabled: false }
  } catch (e) {
    console.error('Could not perform a "getCustomFunctionEngineStatus" check')
    console.error(e)
    return { enabled: false }
  }

  // Helpers:
  async function getPCstatusPre1Dot3(): Promise<ICustomFunctionEngineStatus> {
    const threeDotVersion = /(\d+\.\d+\.\d+)/.exec(Office.context.diagnostics.version)![1]

    if (semver.lt(threeDotVersion, '16.0.9323')) {
      return { enabled: false }
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
        )

        const flightThatMustBeOffPre1Dot3 = (context as any).flighting
          .getFeatureGate('Microsoft.Office.OEP.SdxSandbox')
          .load('value') as OfficeExtension.ClientResult<boolean>

        await context.sync()

        const firstNonTrueIndex = featuresThatWantOn.findIndex(
          item => item.value !== true,
        )
        const allDesirableOnesWereTrue = firstNonTrueIndex < 0
        if (!allDesirableOnesWereTrue) {
          return { enabled: false }
        }

        if (flightThatMustBeOffPre1Dot3.value) {
          return {
            error: `Conflict: please disable the "Microsoft.Office.OEP.SdxSandbox" flight, or install a newer version of Excel`,
            enabled: false,
          }
        }

        return {
          enabled: true,
          nativeRuntime: false /* older version, so can't have the native runtime there */,
        }
      },
    )
  }

  async function getStatusPost1Dot3(): Promise<ICustomFunctionEngineStatus> {
    return tryExcelRun(
      async (context): Promise<ICustomFunctionEngineStatus> => {
        const manager = (Excel as any).CustomFunctionManager.newObject(context).load(
          'status',
        )
        await context.sync()

        return {
          enabled: manager.status.enabled,
          nativeRuntime: manager.status.nativeRuntime,
        }
      },
    )
  }

  async function tryExcelRun(
    callback: (context: Excel.RequestContext) => Promise<ICustomFunctionEngineStatus>,
  ) {
    while (true) {
      try {
        return Excel.run(async context => await callback(context))
      } catch (e) {
        const isInCellEditMode =
          e instanceof OfficeExtension.Error &&
          e.code === Excel.ErrorCodes.invalidOperationInCellEditMode
        if (isInCellEditMode) {
          await pause(2000)
          continue
        } else {
          return { enabled: false }
        }
      }
    }
  }
}

export function getScriptLabTopLevelNamespace() {
  return 'ScriptLab' + (true ? 'Dev' : '') // TODO: (nicobell)
}

export async function getIsCustomFunctionsSupportedOnHost(): Promise<boolean> {
  try {
    // if (environment.current.experimentationFlags.customFunctions.forceOn) {
    //   return true
    // }
    const platform = Office.context.platform

    // For now, only supporting on PC
    // On Web: doesn't work yet, need to debug further. It might have to do with Web not expecting non-JSON-inputted functions.
    // On Mac, a number of issues:
    //   - No way to detect flights, to know if the feature is on.  Also, calling "registerCustomFunctions" when flighted off is successful, so can't key off of a failure.
    //   - Heartbeat doesn't work due to Mac iframe + localStorage (not really fixable)
    //   - Other minor things (E.g., copy-paste of starter snippet didn't work for some reason; maybe a general clipboard issue?...)
    if (platform !== Office.PlatformType.PC) {
      return false
    }

    const threeDotVersion = /(\d+\.\d+\.\d+)/.exec(Office.context.diagnostics.version)![1]

    if (semver.lt(threeDotVersion, '16.0.9323')) {
      // note 16.0.9323 is the version number for windows
      // for mac, it is 16.14.429, but
      return false
    }

    while (true) {
      try {
        // Addtitionally, we need some flights
        const allFlightsOn = await Excel.run(async context => {
          const features = [
            'Microsoft.Office.Excel.AddinDefinedFunctionEnabled',
            'Microsoft.Office.Excel.AddinDefinedFunctionStreamingEnabled',
            'Microsoft.Office.Excel.AddinDefinedFunctionCachingEnabled',
            'Microsoft.Office.Excel.AddinDefinedFunctionUseCalcThreadEnabled',
            'Microsoft.Office.OEP.UdfManifest',
            'Microsoft.Office.OEP.UdfRuntime',
          ].map(name => (context as any).flighting.getFeatureGate(name).load('value'))
          await context.sync()
          const allWereTrue = features.filter(item => !item.value).length === 0

          return allWereTrue
        })

        if (allFlightsOn) {
          break
        } else {
          return false
        }
      } catch (e) {
        const isInCellEditMode =
          e instanceof OfficeExtension.Error &&
          e.code === Excel.ErrorCodes.invalidOperationInCellEditMode
        if (isInCellEditMode) {
          await pause(2000)
          continue
        } else {
          return false
        }
      }
    }

    // If all checks passed:
    return true
  } catch (e) {
    console.error('Could not perform a "getIsCustomFunctionsSupportedOnHost" check')
    console.error(e)
    return false
  }
}
