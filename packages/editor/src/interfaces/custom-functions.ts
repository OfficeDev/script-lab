interface ICFVisualMetadata {
  snippets: ICFVisualSnippetMetadata[];
}

interface ICFVisualSnippetMetadata {
  name: string;
  functions: ICFVisualFunctionMetadata[];
  error?: boolean;
  status: CustomFunctionsRegistrationStatus;
}

interface ICFVisualParameterMetadata extends ICFSchemaParameterMetadata {
  prettyType?: string;
  error?: string;
}

interface ICFVisualFunctionResultMetadata extends ICFSchemaFunctionResultMetadata {
  error?: string;
}

interface ICFVisualFunctionMetadata /* doesn't extend ICFSchemaFunctionMetadata so as not to have "name" */ {
  /** The actual name of the function (no namespace/sub-namespace.  E.g., "add42") */
  funcName: string;

  // Sub-namespaced full name, not capitalized (e.g., "BlankSnippet1.add42") */
  nonCapitalizedFullName: string;

  status: CustomFunctionsRegistrationStatus;
  paramString?: string;
  error?: string | boolean;

  description?: string;
  parameters: ICFVisualParameterMetadata[];
  result: ICFVisualFunctionResultMetadata;
  options: ICFSchemaFunctionOptions;
}

interface ICFSchemaFunctionMetadata {
  name: string;
  description?: string;
  parameters: ICFSchemaParameterMetadata[];
  result: ICFSchemaFunctionResultMetadata;
  options: ICFSchemaFunctionOptions;
}

interface ICFSchemaParameterMetadata {
  name: string;
  description?: string;
  type: CustomFunctionsSchemaSupportedTypes;
  dimensionality: CustomFunctionsSchemaDimensionality;
}

interface ICFSchemaFunctionResultMetadata {
  dimensionality: CustomFunctionsSchemaDimensionality;
  type: CustomFunctionsSchemaSupportedTypes;
}

interface ICFSchemaFunctionOptions {
  sync: boolean;
  stream: boolean;
  cancelable: boolean;
}

type CustomFunctionsSchemaSupportedTypes = 'number' | 'string' | 'boolean' | 'invalid';
type CustomFunctionsSchemaDimensionality = 'invalid' | 'scalar' | 'matrix';

type CustomFunctionsRegistrationStatus = 'good' | 'skipped' | 'error' | 'untrusted';

/** The interface used by Excel to register custom functions (workbook.registerCustomFunctions(...))  */
interface ICustomFunctionsRegistrationApiMetadata {
  functions: ICFSchemaFunctionMetadata[];
}

interface ICustomFunctionsHeartbeatParams {
  clientTimestamp: number;
  loadFromOfficeJsPreviewCachedCopy: boolean;
}

interface ICustomFunctionsRunnerRelevantData {
  name: string;
  id: string;
  libraries: string;
  script: IContentLanguagePair;
  metadata?: ICustomFunctionsSnippetRegistrationData;
}

interface ICustomFunctionsSnippetRegistrationData {
  namespace: string;
  functions: ICFVisualFunctionMetadata[];
}

interface ICustomFunctionsMetadataRequestPostData {
  snippets: ISnippet[];
}

interface IRunnerCustomFunctionsPostData {
  snippets: ICustomFunctionsRunnerRelevantData[];
  loadFromOfficeJsPreviewCachedCopy: boolean;
  displayLanguage: string;
  heartbeatParams: ICustomFunctionsHeartbeatParams;
  experimentationFlags: object; // TODO:
}

interface ICustomFunctionEngineStatus {
  enabled: boolean;
  error?: string;
  nativeRuntime?: boolean;
}

type ConsoleLogTypes = 'log' | 'info' | 'warn' | 'error';

interface ILogData {
  source: string;
  message: any;
  severity: ConsoleLogTypes;
  indent?: number;
}

interface ICustomFunctionSummaryItem {
  status: CustomFunctionsRegistrationStatus;
  snippetName: string;
  funcName: string;
  additionalInfo?: string[];
}

interface IRunnerState {
  isAlive: boolean;
  lastUpdated: number;
}
