import { HYPHENATED_PACKAGE_VERSIONS } from "./package-versions";

export const SCRIPT_URLS = {
  CUSTOM_FUNCTIONS_RUNNER_DEFAULT:
    "https://appsforoffice.microsoft.com/lib/beta/hosted/custom-functions-runtime.js",

  DEFAULT_OFFICE_JS: "https://appsforoffice.microsoft.com/lib/1/hosted/office.js",
  OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD:
    "https://appsforoffice.microsoft.com/lib/beta/hosted/office.js",

  MONACO_LOADER: `./external/monaco-editor-${HYPHENATED_PACKAGE_VERSIONS["monaco-editor"]}/vs/loader.js`,
};

export const DEFAULT_HOST = "WEB";

export const CF_HEARTBEAT_POLLING_INTERVAL = 500;

export enum localStorageKeys {
  customFunctionsLastHeartbeatTimestamp = "playground_custom_functions_last_heartbeat_timestamp",
  customFunctionsLastUpdatedCodeTimestamp = "playground_custom_functions_last_updated_code_timestamp",
  customFunctionsLastRegisteredTimestamp = "playground_custom_functions_last_registered",
  customFunctionsCurrentlyRunningTimestamp = "playground_custom_functions_currently_running_timestamp",
  log = "playground_log",
  customFunctionsRunPostData = "custom_functions_run_post_data",
  originEnvironmentUrl = "playground_origin_environment_url",
  redirectEnvironmentUrl = "playground_redirect_environment_url",
  lastEnvironmentRedirectTimestamp = "playground_last_environment_redirect_timestamp",
  shouldShowLocalhostRedirectOption = "playground_should_show_localhost_redirect_option",

  // Options
  enableRedirect = "playground_enable_redirect",
  enableGitHub = "playground_enable_github",
  enableHideUpdateDialog = "playground_enable_hide_update_dialog",
}

export function getLocalStorage(key: localStorageKeys): string | undefined {
  return localStorage.getItem(key);
}

export function setLocalStorageOption(key: localStorageKeys, value: boolean) {
  const valueString = value ? "true" : "false";
  localStorage.setItem(key, valueString);
}

export function getLocalStorageOption(key: localStorageKeys): boolean {
  const value = localStorage.getItem(key);
  return value === "true";
}

function optionEnabled(key: localStorageKeys) {
  const value = getLocalStorageOption(key);
  return value;
}

/**
 * enable GitHub integration.
 *
 * Returns true if the GitHub integration is enabled.
 * This allows turning on and off the integration without removing the code.
 *
 * Integration Points
 *
 * code screen
 * - login button
 * - overflow share new secret gist
 * - overflow share new public gist
 *
 * my snippets
 * - My shared gists on GitHub
 */
export function enableGitHub() {
  const enabled = optionEnabled(localStorageKeys.enableGitHub);
  return enabled;
}

/**
 * Enable redirecting to different environments
 */
export function enableRedirect() {
  const enabled = optionEnabled(localStorageKeys.enableRedirect);
  return enabled;
}

export const RUNNER_TO_EDITOR_HEARTBEAT_REQUESTS = {
  GET_ACTIVE_SOLUTION: "GET_ACTIVE_SOLUTION",
  GET_PYTHON_CONFIG_IF_ANY: "GET_PYTHON_CONFIG_IF_ANY",
};

export const EDITOR_HEARTBEAT_TO_RUNNER_RESPONSES = {
  ACTIVE_SOLUTION: "ACTIVE_SOLUTION",
  PASS_MESSAGE_TO_USER_SNIPPET: "PASS_MESSAGE_TO_USER_SNIPPET",
};

/** Used both for messages from heartbeat to runner, and for the payload of the
 * "PASS_MESSAGE_TO_USER_SNIPPET" contents
 */
export interface IEditorHeartbeatToRunnerResponse {
  type: string;
  contents: any;
}
