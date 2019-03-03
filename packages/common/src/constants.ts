import { HYPHENATED_PACKAGE_VERSIONS } from './package-versions';

// For offline debugging of Office.js:
// const OFFICE_JS_LOCAL_PACKAGE_URL = `/external/office-js-${
//   HYPHENATED_PACKAGE_VERSIONS['@microsoft/office-js']
// }/office.js`;

export const SCRIPT_URLS = {
  CUSTOM_FUNCTIONS_RUNNER:
    'https://appsforoffice.microsoft.com/lib/preview/hosted/custom-functions-runtime.js',
  DEFAULT_OFFICE_JS: 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js',
  OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD:
    'https://appsforoffice.microsoft.com/lib/beta/hosted/office.js',
  MONACO_LOADER: `/external/monaco-editor-${
    HYPHENATED_PACKAGE_VERSIONS['monaco-editor']
  }/vs/loader.js`,
};

export const DEFAULT_HOST = 'WEB';

export const CF_HEARTBEAT_POLLING_INTERVAL = 500;

export const localStorageKeys = {
  editor: {
    customFunctionsLastHeartbeatTimestamp:
      'playground_custom_functions_last_heartbeat_timestamp',
    customFunctionsLastUpdatedCodeTimestamp:
      'playground_custom_functions_last_updated_code_timestamp',
    customFunctionsLastRegisteredTimestamp: 'playground_custom_functions_last_registered',
    customFunctionsCurrentlyRunningTimestamp:
      'playground_custom_functions_currently_running_timestamp',
    log: 'playground_log',
    customFunctionsRunPostData: 'custom_functions_run_post_data',
    originEnvironmentUrl: 'playground_origin_environment_url',
    redirectEnvironmentUrl: 'playground_redirect_environment_url',
    lastEnvironmentRedirectTimestamp: 'playground_last_environment_redirect_timestamp',
    shouldShowLocalhostRedirectOption: 'playground_should_show_localhost_redirect_option',
  },
};

/** Server "hello" endpoint, used to check that the server is alive */
export const SERVER_HELLO_ENDPOINT = {
  path: 'hello',
  payload: { message: 'Hello from Script Lab' },
};
