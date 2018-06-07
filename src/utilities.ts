const EXT_TO_LANG_MAP = {
  js: 'JavaScript',
  ts: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
}

export function convertExtensionToLanguage(fileName: string): string {
  const extension = fileName.split('.').pop()
  if (extension) {
    return EXT_TO_LANG_MAP[extension.toLowerCase()] || ''
  }
  return ''
}
