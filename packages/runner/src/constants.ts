export const officeNamespacesForIframe = [
  'Office',
  'OfficeExtension',
  'OfficeCore',
  'OfficeRuntime',
  'Excel',
  'Word',
  'OneNote',
  'PowerPoint',
  'Visio',
  'ExcelOp',
];

export const editorUrls = {
  local: 'https://localhost:3000',
  alpha: 'https://script-lab-react-alpha.azurewebsites.net',
  beta: 'https://script-lab-react-beta.azurewebsites.net',
  production: 'https://script-lab.azureedge.net',
};

export function getCurrentEnv(): 'local' | 'alpha' | 'beta' | 'prod' {
  return {
    'http://localhost:3200': 'local',
    'https://localhost:3200': 'local',
    'https://script-lab-react-runner-alpha.azurewebsites.net': 'alpha',
    'https://script-lab-react-runner-beta.azurewebsites.net': 'beta',
    'https://script-lab-react-runner.azurewebsites.net': 'prod',
  }[window.location.origin];
}

export const currentEditorUrl = editorUrls[getCurrentEnv()];
