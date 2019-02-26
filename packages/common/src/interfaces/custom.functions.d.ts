/* The parsed result, as processed by Script Lab.
 * Be sure to pass "IFunction" from the "custom-functions-metadata" package as the "T" argument.
 */
interface ICustomFunctionParseResult<T> {
  /** The as-written name of the function (no namespace/sub-namespace, not capitalized. E.g., "add42") */
  funcName: string;

  // Sub-namespaced full name, not capitalized (e.g., "BlankSnippet1.add42") */
  nonCapitalizedFullName: string;

  status: CustomFunctionsRegistrationStatus;

  // Additional info (e.g., individual error strings)
  additionalInfo?: string[];

  metadata: T;
}

type CustomFunctionsRegistrationStatus = 'good' | 'skipped' | 'error' | 'untrusted';

/** The interface used by Excel to register custom functions (CustomFunctionManager.register(...)).
 * Be sure to pass "IFunction" from the "custom-functions-metadata" package as the "T" argument.
 */
interface ICustomFunctionsRegistrationApiMetadata<T> {
  functions: T[];
}

interface ICustomFunctionEngineStatus {
  enabled: boolean;
  nativeRuntime?: boolean;
}

interface ICustomFunctionsHeartbeatMessage {
  type: 'metadata' | 'refresh' | 'log';
  payload?: any;
}

interface ICustomFunctionsHeartbeatMetadata {
  solutionId: string;
  namespace: string;
  functionNames: string[];
  code: string; // compiled js
  jsLibs: string[];
}

interface ICustomFunctionsHeartbeatGetMetadataMessage
  extends ICustomFunctionsHeartbeatMessage {
  type: 'metadata';
  payload: ICustomFunctionsHeartbeatMetadata[];
}

interface ICustomFunctionsHeartbeatLogMessage extends ICustomFunctionsHeartbeatMessage {
  type: 'log';
  payload: ILogData;
}
