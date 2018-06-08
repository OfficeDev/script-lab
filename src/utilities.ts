const EXT_TO_LANG_MAP = {
  js: 'JavaScript',
  ts: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
};

export function convertExtensionToLanguage(file): string {
  if (!file) {
    return '';
  }

  const extension = file.name.split('.').pop();
  if (extension) {
    return EXT_TO_LANG_MAP[extension.toLowerCase()] || '';
  }
  return '';
}
