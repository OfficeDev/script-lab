import WebRuntime from './WebRuntime'
import IRuntime from './IRuntime'

export async function createRuntime(
  scriptId: string,
  scriptCode: string,
  lastUpdatedTime: number,
): Promise<IRuntime> {
  // TODO: Check office js host info to return the correct runtime
  const runtime: IRuntime = await WebRuntime.createRuntimeInstance(
    scriptId,
    scriptCode,
    lastUpdatedTime,
  )
  return runtime
}
