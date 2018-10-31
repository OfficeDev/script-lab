import ObjectStore from './util/ObjectStore'
import IRuntime from './IRuntime'
import { RuntimeState } from './RuntimeState'
import { createRuntime } from './RuntimeFactory'

export default class RuntimeManager {
  private static instance: RuntimeManager
  private runtimeMap: ObjectStore<IRuntime>
  private options: { serviceUrl: string } | undefined

  static getInstance(options?: { serviceUrl: string }) {
    return (
      RuntimeManager.instance || (RuntimeManager.instance = new RuntimeManager(options))
    )
  }

  private constructor(options?: { serviceUrl: string }) {
    this.options = options
    this.runtimeMap = new ObjectStore<IRuntime>()
  }

  // TODO: Runtime limitations/permissions to be passed, as well as other dependencies
  async executeScript(
    scriptId: string,
    scriptCode: string,
    functionName: string,
    functionArgs: any[],
    lastUpdatedTime: number,
  ): Promise<any> {
    return new Promise<any>(async resolve => {
      let runtime: IRuntime
      if (this.runtimeMap.keyExists(scriptId)) {
        runtime = this.runtimeMap.read(scriptId)
        if (runtime.getLastUpdatedTime() === lastUpdatedTime) {
          const result = await runtime.executeFunction(functionName, functionArgs)
          return resolve(result)
        }

        await this.terminateRuntime(scriptId)
      }

      runtime = await createRuntime(scriptId, scriptCode, lastUpdatedTime, this.options)
      this.runtimeMap.create(scriptId, runtime)
      const result = await runtime.executeFunction(functionName, functionArgs)
      return resolve(result)
    })
  }

  getRuntimeIds(): string[] {
    return this.runtimeMap.keys()
  }

  async terminateAll(): Promise<boolean[]> {
    return Promise.all(this.getRuntimeIds().map(id => this.terminateRuntime(id)))
  }

  async terminateRuntime(scriptId: string): Promise<boolean> {
    return new Promise<boolean>(async resolve => {
      if (this.runtimeMap.keyExists(scriptId)) {
        const runtime: IRuntime = this.runtimeMap.read(scriptId)
        await runtime.terminate()
        this.runtimeMap.delete(scriptId)
        return resolve(true)
      }

      return resolve(false)
    })
  }

  async getState(scriptId: string): Promise<RuntimeState> {
    return new Promise<RuntimeState>(resolve => {
      if (this.runtimeMap.keyExists(scriptId)) {
        const state = this.runtimeMap.read(scriptId).getState()
        return resolve(state)
      }

      return resolve(RuntimeState.NonExisting)
    })
  }
}
