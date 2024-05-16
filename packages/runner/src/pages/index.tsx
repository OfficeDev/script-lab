import React from "react";
import { parse } from "query-string";

import PageSwitcher, { IPageLoadingSpec } from "common/build/components/PageSwitcher";
import { SCRIPT_URLS } from "common/build/constants";
import { OFFICE_JS_URL_QUERY_PARAMETER_KEY } from "common/build/utilities/script-loader/constants";

import { PATHS } from "../constants";
import { CustomFunctionsRunner } from "./CustomFunctionsRunner";
import { Runner } from "./Runner";

// Note: To add a page you must add the path for the page in
// src/constants.ts add it into the structure below:
const pages: { [key: string]: IPageLoadingSpec } = {
  [PATHS.CustomFunctionsRunner]: {
    component: CustomFunctionsRunner,
    officeJs: null /* Will load its own custom-functions-runtime script, not Office.js as such */,
  },
  [PATHS.Runner]: {
    component: Runner,
    officeJs: getOfficeJsUrlToLoad(),
  },
};

export default () => <PageSwitcher pages={pages} defaultPath={PATHS.Runner} />;

/// ////////////////////////////////////

function getOfficeJsUrlToLoad(): string {
  const params = parse(window.location.search) as {
    [OFFICE_JS_URL_QUERY_PARAMETER_KEY]: string;
  };

  return (params[OFFICE_JS_URL_QUERY_PARAMETER_KEY] || "").trim().length > 0
    ? params[OFFICE_JS_URL_QUERY_PARAMETER_KEY]
    : SCRIPT_URLS.DEFAULT_OFFICE_JS;
}
