import { findScript } from '.';

export default (pythonCFs: ISolution[], options: { clearOnRegister: boolean }) => {
  return [
    'import customfunctionmanager',
    options.clearOnRegister ? 'customfunctionmanager.clear()' : null,
    '',
    '#######################################',
    '',
    ...pythonCFs
      .filter(solution => !solution.options.isUntrusted)
      .map(solution => findScript(solution).content),
    '',
    '#######################################',
    '',
    'customfunctionmanager.generateMetadata()',
  ]
    .filter(line => line !== null)
    .join('\n');
};
