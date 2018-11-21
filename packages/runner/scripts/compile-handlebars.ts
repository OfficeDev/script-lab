import fs, { fstatSync } from 'fs-extra';
import shelljs from 'shelljs';

const templatesPath = './src/components/Snippet/templates';
const compiledTemplatesPath = `${templatesPath}/compiled`;

// delete old compiled handlebars
fs.readdirSync(compiledTemplatesPath).map(file =>
  fs.removeSync(`${compiledTemplatesPath}/${file}`),
);

// generate new ones
fs.readdirSync(templatesPath)
  .filter(file => /.*\.handlebars$/.test(file))
  .map(file => [
    `${templatesPath}/${file}`,
    `${compiledTemplatesPath}/${file.split('.')[0]}.handlebars.ts`,
  ])
  .map(([sourcePath, destPath]) =>
    shelljs.exec(`handlebars ${sourcePath} -f ${destPath}`),
  );
