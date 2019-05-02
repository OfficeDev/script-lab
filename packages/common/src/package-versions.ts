export const PACKAGE_VERSIONS = {
  'monaco-editor': '0.16.2',
  '@microsoft/office-js': '1.1.12-custom.8',
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
