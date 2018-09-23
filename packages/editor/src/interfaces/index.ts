interface IMessageBar {
  isVisible: boolean
  text: string
  style: any // MessageBarType from fabric
  link: { text: string; url: string } | null
}

interface IGithubGistPayload {
  id: string
}
