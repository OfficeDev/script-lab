import { Regex } from './utilities';

describe('Editor utilities', () => {
  describe('regexes', () => {
    describe('TripleSlashRefs', () => {
      it('should be able to parse these refs', () => {
        const validRefs = {
          '/// <reference path="./common/common.d.ts" />': './common/common.d.ts',
          '/// <reference path="./common/function.d.ts" />': './common/function.d.ts',
          '/// <reference path="./common/seq.d.ts" />': './common/seq.d.ts',
          '/// <reference path="JQueryStatic.d.ts" />': 'JQueryStatic.d.ts',
        };

        Object.keys(validRefs).forEach((ref: string) => {
          const tsr = new RegExp(Regex.TRIPLE_SLASH_REF);
          expect(tsr.exec(ref)).toContain(validRefs[ref]);
        });
      });
    });
  });
});
