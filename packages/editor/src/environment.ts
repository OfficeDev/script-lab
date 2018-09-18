export const authServerUrl = {
  development: 'https://localhost:5000',
  prod: 'asdf',
}[process.env.NODE_ENV || 'development']

export const githubAppClientId = {
  development: '210a167954d9ef04b501',
  production: '5db9e6dbe957707a3cb2',
}[process.env.NODE_ENV || 'development']
