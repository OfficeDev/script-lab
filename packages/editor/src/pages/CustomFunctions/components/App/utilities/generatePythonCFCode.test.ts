import YAML from 'js-yaml';

import generatePythonCFCode from './generatePythonCFCode';
import { stripSpaces } from 'common/lib/utilities/string';
import { convertSnippetToSolution } from '../../../../../utils';

const basicCF = convertSnippetToSolution(
  YAML.safeLoad(
    stripSpaces(`
  name: Custom Function (Python)
  description: A basic Custom Function, written in Python
  host: EXCEL
  api_set: {}
  script:
    content: |
      import customfunctions as cf
      @cf.customfunction("ADD")
      def myadd(x, y):
        return x + y
    language: python
`),
  ),
);

describe('primitives', () => {
  it('basic', () =>
    expect(generatePythonCFCode([basicCF], { clearOnRegister: true })).toEqual(
      stripSpaces(`
        import customfunctionmanager
        customfunctionmanager.clear()
        
        #######################################
        
        import customfunctions as cf
        @cf.customfunction("ADD")
        def myadd(x, y):
          return x + y
        
        
        #######################################
        
        customfunctionmanager.generateMetadata()
      `),
    ));
});

// cspell:ignore customfunctions myadd
