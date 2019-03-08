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
{
  FIXME
    "functions": [
      ...
    ],
    "extras": [

    ]
  }
*/
// ============================================================================================

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
  // tslint:disable-next-line
  let [code, meta] = content.split('// result');
  meta = meta.substring(meta.indexOf('/*') + 3, meta.lastIndexOf('*/')).trim();

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
            namespace: file,
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
      it(description, () => {
        expect(
          parseMetadata({
            solution: {
              name: file,
              options: {},
            },
            namespace: file,
            fileContent: code,
          }),
        ).toEqual(JSON.parse(meta));
      });
    }
  });
});

// cspell:ignore testname
