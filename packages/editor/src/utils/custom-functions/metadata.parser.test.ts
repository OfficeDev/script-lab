import * as fs from 'fs';

import { parseMetadata } from '.';

const SAMPLE_DIR = './src/utils/custom-functions/samples';

// To add test-cases for the custom functions metadata parser, follow the format of the following
// and place it in the samples directory

// ====================================NORMAL-TEST-CASE========================================
// // description of the test (ex: should be able to handle X)

//        [ CODE FOR TESTING ]

// // result
/*
 */
// ============================================================================================

// By leaving the result empty, the test will fail and output the expected result for you,
//   so you can manually validate that it matches what you expect, and then paste it in.

// For the error test-cases (when you expect the file to throw), name the file error.testname.ts.
// (filename must start with `error.`)

function parseSampleFile(
  fileName: string,
): { description: string; code: string; meta: string } {
  const lines = fs
    .readFileSync(`${SAMPLE_DIR}/${fileName}`)
    .toString()
    .split('\n');
  const description = lines[0].slice(3);
  const content = lines.slice(1).join('\n');

  const [code, result] = content.split('// result');
  if (!result) {
    throw new Error(`Could not find "// result" on file "${fileName}"`);
  }
  const meta = result
    .substring(result.indexOf('/*') + 3, result.lastIndexOf('*/'))
    .trim();

  return { description, code, meta };
}

describe('Custom Functions metadata parser ', () => {
  fs.readdirSync(SAMPLE_DIR).forEach((file: string) => {
    if (file.startsWith('error.')) {
      it(`should throw an error for the function in ${file}`, () => {
        const source = fs.readFileSync(`${SAMPLE_DIR}/${file}`).toString();
        expect(() => {
          parseMetadata({
            solution: {
              name: file,
              options: {},
            },
            namespace: 'TestNamespace',
            fileContent: source,
          }).forEach(result => {
            if (result.errors.length > 0) {
              throw Error();
            }
          });
        }).toThrow();
      });
    } else {
      // for each file in the samples directory, parse it and test it
      const { description, code, meta } = parseSampleFile(file);
      it(`"${file}": "${description}"`, () => {
        const result = parseMetadata({
          solution: {
            name: file,
            options: {},
          },
          namespace: 'TestNamespace',
          fileContent: code,
        });

        if (meta.length === 0) {
          console.log(
            `"${file}" has an empty result.  It should probably be something like:`,
          );
          console.log(JSON.stringify(result, null, 4));
          console.log('==============');
          throw new Error('Missing result. Please paste it in.');
        }

        expect(result).toEqual(JSON.parse(meta));
      });
    }
  });
});

// cspell:ignore testname
