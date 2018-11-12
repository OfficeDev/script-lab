import { RuntimeState } from './RuntimeState';

export default interface IRuntime {
  executeFunction(functionName: string, functionArgs: any[]): Promise<any>;
  getId(): string;
  getLastUpdatedTime(): number;
  getState(): Promise<RuntimeState>;
  terminate(): Promise<void>;
}
