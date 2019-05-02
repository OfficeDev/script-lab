/* The parsed result, as processed by Script Lab.
 * Be sure to pass "IFunction" from the "custom-functions-metadata" package as the "T" argument.
 * This is necessary for keeping the ICustomFunctionParseResult declaration ambient
 *   (or else it would require always importing this file)
 */
interface ICustomFunctionParseResult<T> {
  /** The as-written name of the function (no namespace/sub-namespace, not capitalized. E.g., "add42") */
  javascriptFunctionName: string;

  // Sub-namespaced full name, not capitalized (e.g., "BlankSnippet1.add42") */
  nonCapitalizedFullName: string;

  status: CustomFunctionsRegistrationStatus;

  // Errors, if any
  errors?: string[];

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

interface ICustomFunctionsHeartbeatGetMetadataMessage
  extends ICustomFunctionsHeartbeatMessage {
  type: 'metadata';
  payload: ICustomFunctionsHeartbeatMetadata[];
}

interface ICustomFunctionsHeartbeatLogMessage extends ICustomFunctionsHeartbeatMessage {
  type: 'log';
  payload: ILogData;
}

interface ICustomFunctionsIframeRunnerOnLoadPayload {
  typescriptMetadata: ICustomFunctionsIframeRunnerTypeScriptMetadata[];
  pythonConfig?: IPythonConfig;
}

interface ICustomFunctionsIframeRunnerTypeScriptMetadata {
  solutionId: string;
  namespace: string;
  functions: Array<{
    fullId: string;
    fullDisplayName: string;
    javascriptFunctionName: string;
  }>;
  code: string;
  jsLibs: string[];
}

interface IPythonConfig {
  url: string;
  token: string;
  notebook: string;
}
