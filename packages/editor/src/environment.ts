export const authServerUrl = {
  local: 'https://localhost:5000',
  prod: 'asdf',
}[process.env.REACT_APP_STAGING || 'prod']

export const githubAppClientId = {
  local: '210a167954d9ef04b501',
  prod: '5db9e6dbe957707a3cb2',
}[process.env.REACT_APP_STAGING || 'prod']

export const environmentName = {
  local: 'local',
  alpha: 'react-alpha',
  beta: 'react-beta',
  prod: 'react',
}[process.env.REACT_APP_STAGING || 'prod']

export const editorUrls = {
  local: 'https://localhost:3000',
  'react-alpha': 'https://script-lab-react-alpha.azurewebsites.net',
  'react-beta': 'https://script-lab-react-beta.azurewebsites.net',
  alpha: 'https://bornholm-edge.azurewebsites.net',
  beta: 'https://bornholm-insiders.azurewebsites.net',
  production: 'https://script-lab.azureedge.net',
}
