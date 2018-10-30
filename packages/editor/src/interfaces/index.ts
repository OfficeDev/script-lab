interface IMessageBar {
  isVisible: boolean
  text: string
  style: any // MessageBarType from fabric
  link: { text: string; url: string } | null
}

interface IGithubGistPayload {
  id: string
}

interface IDefaultFunctionRunMetadata {
  name: string
  status: 'Idle' | 'Running' | 'Success' | 'Failure'
}

interface IDefaultSnippetRunMetadata {
  name: string
  functions: IDefaultFunctionRunMetadata[]
}
