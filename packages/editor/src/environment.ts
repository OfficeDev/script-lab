export const authServerUrl = {
  local: 'http://localhost:5000',
  alpha: 'https://script-lab-react-server-alpha.azurewebsites.net',
  beta: 'https://script-lab-react-server-beta.azurewebsites.net',
  prod: 'https://script-lab-react-server.azurewebsites.net',
}[getCurrentEnv()]

export const githubAppClientId = {
  local: '210a167954d9ef04b501',
  alpha: 'ad26df7ba62ef691669e',
  beta: 'edb61fe543b382628d68',
  prod: '5db9e6dbe957707a3cb2',
}[getCurrentEnv()]

export const environmentName = {
  local: 'local',
  alpha: 'react-alpha',
  beta: 'react-beta',
  prod: 'react',
}[getCurrentEnv()]

export const editorUrls = {
  local: 'https://localhost:3000',
  'react-alpha': 'https://script-lab-react-alpha.azurewebsites.net',
  'react-beta': 'https://script-lab-react-beta.azurewebsites.net',
  alpha: 'https://bornholm-edge.azurewebsites.net',
  beta: 'https://bornholm-insiders.azurewebsites.net',
  production: 'https://script-lab.azureedge.net',
}

export function getCurrentEnv(): 'local' | 'alpha' | 'beta' | 'prod' {
  return {
    'https://localhost:3000': 'local',
    'https://script-lab-react-alpha.azurewebsites.net': 'alpha',
    'https://script-lab-react-beta.azurewebsites.net': 'beta',
    'https://script-lab-react.azurewebsites.net': 'prod',
  }[window.location.origin]
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
  const w = window as any
  return ((w.Office && w.Office.context && w.Office.context.platform) ||
    PlatformType.OfficeOnline) as PlatformType
}
