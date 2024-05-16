// https://res.sdf.cdn.office.net/
// https://script-lab.sdf.cdn.office.net
// https://script-lab-runner.sdf.cdn.office.net

/**
 * Special target domain for testing.
 * Places the editor and runner on the same domain under edit and run folders.
 * Uncomment for local testing with the domain.
 */
const targetDomain = "https://contoso.com"; //"https://wbp-autobox-002.redmond.corp.microsoft.com:444";

/**
 * And environment is a deployment endpoint.
 */
interface SwitchableEnvironments {
  local: string;

  target: string;

  temp: string;

  /**
   * Public SDF
   * https://res-sdf.cdn.office.net/script-lab/
   *
   * https://script-lab.sdf.cdn.office.net/script-lab/
   * https://script-lab-runner.sdf.cdn.office.net/script-lab-runner/
   *
   */
  cdnPreview: string;

  /**
   * Public WW
   * https://res.cdn.office.net/script-lab/
   *
   * https://script-lab.public.cdn.office.net/script-lab/
   * https://script-lab-runner.public.cdn.office.net/script-lab-runner/
   */
  cdnProduction: string;
}

export const editorUrls: SwitchableEnvironments = {
  local: "https://localhost:3000", // /script-lab/7dttl (for simulate)

  target: `${targetDomain}/script-lab/edit`,

  temp: `https://script-lab.azureedge.net`,

  cdnPreview: "https://script-lab.sdf.cdn.office.net/script-lab/7dttl",
  cdnProduction: "https://script-lab.public.cdn.office.net/script-lab/7dttl",
};

const runnerUrls: SwitchableEnvironments = {
  local: "https://localhost:3200", // script-lab-runner/7dttl (for simulate)

  target: `${targetDomain}/script-lab/run`,

  temp: `https://script-lab.azureedge.net`,

  cdnPreview: "https://script-lab-runner.sdf.cdn.office.net/script-lab-runner/7dttl",
  cdnProduction: "https://script-lab-runner.public.cdn.office.net/script-lab-runner/7dttl",
};

export const environmentDisplayNames: SwitchableEnvironments = (() => {
  const preliminary = {
    local: "localhost",

    target: "Target",
    
    temp: "Temp",

    cdnPreview: "CDN Preview",
    cdnProduction: "CDN Production",
  };

  return preliminary;
})();

/// ///////////////////////

// Need to differentiate between url and origin

/**
 * @deprecated remove server
 */
export const currentServerUrl = "";

/**
 * @deprecated remove server
 */
export const githubAppClientId = "";

export const currentRunnerUrl = runnerUrls[getCurrentEnv()];
export const currentEditorUrl = editorUrls[getCurrentEnv()];
export const environmentDisplayName = environmentDisplayNames[getCurrentEnv()];

/**
 * Do two urls share the same origin?
 */
export function sameOrigin(a: string, b: string) {
  const urlA = new URL(a);
  const urlB = new URL(b);
  return urlA.origin === urlB.origin;
}

export function getOrigin(url: string): string {
  const fullUrl = new URL(url);
  return fullUrl.origin;
}

export const currentOfficeJsRawSnippetsBaseRepoUrl = `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/${
  // Swap the branch the samples are taken from on GitHub
  getCurrentEnv() === "cdnProduction" ? "prod" : "main"
}`;

export function getVisibleEnvironmentKeysToSwitchTo(): Array<keyof SwitchableEnvironments> {
  return [];
}

/**
 * Gets the current react environment based on the current url.
 */
export function getCurrentEnv(): keyof SwitchableEnvironments {
  const environmentTypesToSearch = [editorUrls, runnerUrls];
  const origin = window.location.origin;

  for (const environmentToSearch of environmentTypesToSearch) {
    for (const key in environmentToSearch) {
      const value = environmentToSearch[key];
      // Have to look at value origin, not value, because value might be a path.
      const url = new URL(value);
      const valueOrigin = url.origin;
      if (origin === valueOrigin) {
        return key as keyof SwitchableEnvironments;
      }
    }
  }

  // For jest tests, it looks like the window.location.origin is set to
  // "http://localhost" (as http rather than https, and without a port number).
  // Allow that through to avoid throwing an exception and failing the tests.
  if (origin === "http://localhost") {
    return "local";
  }

  throw new Error(`Invalid environment. URL "${origin}" not found in environments list.`);
}
