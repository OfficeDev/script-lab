interface IReactEnvironments {
  local: string;
  alpha: string;
  beta: string;
  staging: string;
  production: string;
  cdn: string;
}

interface I2017Environments {
  alpha2017: string;
  beta2017: string;
}

interface IAllSwitchableEnvironments extends IReactEnvironments, I2017Environments {}

const serverUrls: IReactEnvironments = {
  local: 'http://localhost:5000',
  alpha: 'https://script-lab-react-server-alpha.azurewebsites.net',
  beta: 'https://script-lab-react-server-beta.azurewebsites.net',
  staging: 'https://script-lab-react-server-staging.azurewebsites.net',
  production: 'https://script-lab-react-server.azurewebsites.net',
  cdn: 'https://script-lab-server.azureedge.net',
};

const githubAppClientIds: IReactEnvironments = {
  local: '210a167954d9ef04b501',
  alpha: 'ad26df7ba62ef691669e',
  beta: 'edb61fe543b382628d68',
  staging: '',
  production: '',
  cdn: '55031174553ee45f92f4',
};

export const environmentDisplayNames: IAllSwitchableEnvironments = {
  local: 'localhost:3000',
  alpha: 'Alpha',
  beta: 'Beta',
  staging: 'Staging',
  production: 'Production (direct)',
  cdn: 'Production',
  alpha2017: 'Script Lab 2017 - Alpha',
  beta2017: 'Script Lab 2017 - Beta',
};

export const editorUrls: IAllSwitchableEnvironments = {
  local: 'https://localhost:3000',
  alpha: 'https://script-lab-react-alpha.azurewebsites.net',
  beta: 'https://script-lab-react-beta.azurewebsites.net',
  staging: 'https://script-lab-react-staging.azurewebsites.net',
  production: 'https://script-lab-react.azurewebsites.net',
  cdn: 'https://script-lab.azureedge.net',
  alpha2017: 'https://bornholm-edge.azurewebsites.net',
  beta2017: 'https://bornholm-insiders.azurewebsites.net',
};

export const runnerUrls: IReactEnvironments = {
  local: 'https://localhost:3200',
  alpha: 'https://script-lab-react-runner-alpha.azurewebsites.net',
  beta: 'https://script-lab-react-runner-beta.azurewebsites.net',
  staging: 'https://script-lab-react-runner-staging.azurewebsites.net',
  production: 'https://script-lab-react-runner.azurewebsites.net',
  cdn: 'https://script-lab-runner.azureedge.net',
};

//////////////////////////

export const currentServerUrl = serverUrls[getCurrentEnv()];
export const currentRunnerUrl = runnerUrls[getCurrentEnv()];
export const currentEditorUrl = editorUrls[getCurrentEnv()];
export const githubAppClientId = githubAppClientIds[getCurrentEnv()];
export const environmentDisplayName = environmentDisplayNames[getCurrentEnv()];
export const currentOfficeJsRawSnippetsBaseRepoUrl = `https://raw.githubusercontent.com/OfficeDev/office-js-snippets/${
  getCurrentEnv() === 'cdn' ? 'deploy-prod' : 'deploy-beta'
}`;

export function getVisibleEnvironmentKeysToSwitchTo(): Array<
  keyof IAllSwitchableEnvironments
> {
  const basicEnvironments: Array<keyof IAllSwitchableEnvironments> = [
    'cdn',
    'beta',
    'alpha',
    'beta2017',
  ];

  switch (getCurrentEnv()) {
    case 'local':
    case 'alpha':
      return [...basicEnvironments, 'alpha2017', 'production', 'staging', 'local'];
    default:
      return basicEnvironments;
  }
}

export function getCurrentEnv(): keyof IReactEnvironments {
  const environmentTypesToSearch = [editorUrls, runnerUrls];

  for (const environmentToSearch of environmentTypesToSearch) {
    for (const key in environmentToSearch) {
      const value = (environmentToSearch as any)[key];
      if (window.location.origin.indexOf(value) === 0) {
        return key as keyof IReactEnvironments;
      }
    }
  }

  // For jest tests, it looks like the window.location.origin is set to
  // "http://localhost" (as http rather than https, and without a port number).
  // Allow that through to avoid throwing an exception and failing the tests.
  if (window.location.origin === 'http://localhost') {
    return 'local';
  }

  throw new Error(
    `Invalid environment. URL "${
      window.location.origin
    }" not found in environments list.`,
  );
}

export enum PlatformType {
  PC = 'PC',
  OfficeOnline = 'OfficeOnline',
  Mac = 'Mac',
  iOS = 'iOS',
  Android = 'Android',
  Universal = 'Universal',
}

export function getPlatform(): PlatformType {
  return (((window as any).Office &&
    (window as any).Office.context &&
    (window as any).Office.context.platform) ||
    PlatformType.OfficeOnline) as PlatformType;
}
