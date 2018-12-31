export const PACKAGE_VERSIONS = {
  'monaco-editor': '0.14.3',
  'monaco-editor-old':
    '0.10.1' /* for Mac mouse-focus issue, see more at
    https://github.com/OfficeDev/script-lab/issues/506 */,
  '@microsoft/office-js': '1.1.11-adhoc.28',
};

export const HYPHENATED_PACKAGE_VERSIONS: typeof PACKAGE_VERSIONS = (() => {
  const result = {} as any;
  for (const key in PACKAGE_VERSIONS) {
    result[key] = hyphenate((PACKAGE_VERSIONS as any)[key] as any);
  }
  return result;
})();

export function hyphenate(versionString: string) {
  return versionString.replace(/\./g, '-');
}
