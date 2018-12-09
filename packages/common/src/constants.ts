const OFFICE_JS_LOCAL_PACKAGE_URL = '/external/office-js-1-1-11-adhoc-28/office.js';

export const SCRIPT_URLS = {
  OFFICE_JS_FOR_EDITOR: 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js',
  OFFICE_JS_FOR_CUSTOM_FUNCTIONS_DASHBOARD: OFFICE_JS_LOCAL_PACKAGE_URL,
  MONACO_LOADER: `/external/monaco-editor-0-14-3/vs/loader.js`,
};

export const DEFAULT_HOST = 'WEB';

export const CF_HEARTBEAT_POLLING_INTERVAL = 500;

export const localStorageKeys = {
  editor: {
    customFunctionsLastHeartbeatTimestamp:
      'playground_custom_functions_last_heartbeat_timestamp',
    customFunctionsLastUpdatedCodeTimestamp:
      'playground_custom_functions_last_updated_code_timestamp',
    customFunctionsCurrentlyRunningTimestamp:
      'playground_custom_functions_currently_running_timestamp',
    log: 'playground_log',
    customFunctionsRunPostData: 'custom_functions_run_post_data',
    originEnvironmentUrl: 'playground_origin_environment_url',
    redirectEnvironmentUrl: 'playground_redirect_environment_url',
  },
};
