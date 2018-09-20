export const authServerUrl = {
  local: 'https://localhost:5000',
  alpha: 'https://script-lab-react-server-alpha.azurewebsites.net',
  beta: 'https://script-lab-react-server-beta.azurewebsites.net',
  prod: 'https://script-lab-react-server.azurewebsites.net',
}[process.env.REACT_APP_STAGING || 'prod']

export const githubAppClientId = {
  local: '210a167954d9ef04b501',
  alpha: 'ad26df7ba62ef691669e',
  beta: 'edb61fe543b382628d68',
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
