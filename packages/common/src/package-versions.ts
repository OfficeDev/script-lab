export const PACKAGE_VERSIONS = {
  'monaco-editor': '0.18.1' /* the latest version that supports IE11 */,
  '@microsoft/office-js': '1.1.11-adhoc.28',
};

export const HYPHENATED_PACKAGE_VERSIONS: typeof PACKAGE_VERSIONS = (() => {
  const result = {} as any;
  for (const key in PACKAGE_VERSIONS) {
    result[key] = hyphenate((PACKAGE_VERSIONS as any)[key]);
  }
  return result;
})();

export function hyphenate(versionString: string) {
  return versionString.replace(/\./g, '-');
}
